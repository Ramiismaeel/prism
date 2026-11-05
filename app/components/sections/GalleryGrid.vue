<script setup lang="ts">
import { AnimatePresence, LayoutGroup, Motion, useReducedMotion } from "motion-v";
import { galleryCategories, galleryItems, SHAPE_SIZE, type GalleryCategory, type GalleryShape } from "~/data/gallery";
import { picsum } from "~/utils/picsum";

type Filter = "all" | GalleryCategory;
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...galleryCategories.map((c) => ({ id: c, label: c[0]!.toUpperCase() + c.slice(1) })),
];
const active = ref<Filter>("all");
const visible = computed(() =>
  active.value === "all" ? galleryItems : galleryItems.filter((i) => i.category === active.value),
);
const count = (f: Filter) => (f === "all" ? galleryItems.length : galleryItems.filter((i) => i.category === f).length);

// Masonry via CSS grid: 10px rows, each tile spans enough rows for its shape (incl. a 16px gap).
const ROWS: Record<GalleryShape, number> = { tall: 44, portrait: 36, square: 30, landscape: 23 };
const rowSpan = (shape: GalleryShape) => ({ gridRowEnd: `span ${ROWS[shape]}` });

const lightbox = ref<number | null>(null);

const reduceMotion = useReducedMotion();
const spring = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 30 },
);
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8" aria-label="Photo gallery">
    <div role="group" aria-label="Filter photos by category" class="mb-8 flex flex-wrap justify-center gap-2">
      <button
        v-for="f in filters"
        :key="f.id"
        type="button"
        :aria-pressed="active === f.id"
        class="relative rounded-full px-4 py-2 text-sm font-medium transition-colors"
        :class="active === f.id ? 'text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'"
        @click="active = f.id"
      >
        <Motion v-if="active === f.id" layout-id="gallery-filter" class="absolute inset-0 rounded-full bg-grape" :transition="spring" />
        <span class="relative">{{ f.label }} <span class="font-normal">{{ count(f.id) }}</span></span>
      </button>
    </div>
    <p class="sr-only" aria-live="polite">Showing {{ visible.length }} photos</p>

    <!-- popLayout: leaving tiles are taken out of the flow at once, so the rest glide into place.
         LayoutGroup: tiles only measure themselves when they re-render; the group makes every
         tile re-measure when a sibling enters or leaves. -->
    <LayoutGroup>
    <AnimatePresence
      as="ul"
      mode="popLayout"
      class="relative grid auto-rows-[10px] grid-cols-1 gap-x-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <Motion
        v-for="(item, i) in visible"
        :key="item.id"
        as="li"
        layout
        class="pb-4"
        :style="rowSpan(item.shape)"
        :initial="{ opacity: 0, scale: 0.85 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 0.85 }"
        :transition="spring"
      >
        <button
          type="button"
          class="group relative block h-full w-full overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800"
          :aria-label="`Open ${item.title} (${item.category})`"
          @click="lightbox = i"
        >
          <NuxtImg
            format="webp"
            :src="picsum(item.id, SHAPE_SIZE[item.shape].width, SHAPE_SIZE[item.shape].height)"
            :alt="item.title"
            :width="SHAPE_SIZE[item.shape].width / 2"
            :height="SHAPE_SIZE[item.shape].height / 2"
            sizes="100vw sm:50vw lg:400px"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-linear-to-t from-zinc-950/80 to-transparent p-4 pt-12 text-left text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            <span>
              <span class="block font-semibold">{{ item.title }}</span>
              <span class="block text-xs tracking-widest uppercase">{{ item.category }}</span>
            </span>
            <Icon name="lucide:zoom-in" class="size-5 shrink-0" />
          </span>
        </button>
      </Motion>
    </AnimatePresence>
    </LayoutGroup>

    <SectionsGalleryLightbox v-model:index="lightbox" :items="visible" />
  </section>
</template>
