<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";
import { SHAPE_SIZE, type GalleryItem } from "~/data/gallery";
import { picsum } from "~/utils/picsum";

/** Index into `items` of the open photo; null when closed. */
const index = defineModel<number | null>("index", { required: true });
const props = defineProps<{ items: GalleryItem[] }>();

const open = computed({
  get: () => index.value !== null,
  set: (value) => {
    if (!value) index.value = null;
  },
});
// Keep showing the last photo while the modal plays its exit animation.
const item = ref<GalleryItem>();
const position = ref(0);
watch(
  index,
  (i) => {
    const next = i === null ? undefined : props.items[i];
    if (next) {
      item.value = next;
      position.value = i!;
    }
  },
  { immediate: true },
);

// Large version, max 1600px on the long side.
const large = computed(() => {
  if (!item.value) return undefined;
  const { width, height } = SHAPE_SIZE[item.value.shape];
  const scale = 1600 / Math.max(width, height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
});

const direction = ref(1);
function step(delta: number) {
  if (index.value === null) return;
  direction.value = delta;
  index.value = (index.value + delta + props.items.length) % props.items.length;
}

// Arrow keys while open (ESC and the focus trap are handled by UiModal).
function onKeydown(e: KeyboardEvent) {
  if (!open.value) return;
  if (e.key === "ArrowRight") step(1);
  else if (e.key === "ArrowLeft") step(-1);
}
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

const reduceMotion = useReducedMotion();
const transition = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 28 },
);
</script>

<template>
  <UiModal
    v-model:open="open"
    :title="item?.title ?? ''"
    :description="item ? `${item.category} · ${position + 1} of ${items.length}` : undefined"
    size="xl"
  >
    <div v-if="item && large" class="relative">
      <!-- The image zooms in on open and slides between photos; both stack in one grid cell. -->
      <div class="grid place-items-center overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-950">
        <AnimatePresence :initial="true" :custom="direction">
          <Motion
            :key="item.id"
            as="div"
            class="col-start-1 row-start-1"
            :initial="{ opacity: 0, scale: 0.85, x: 60 * direction }"
            :animate="{ opacity: 1, scale: 1, x: 0 }"
            :exit="{ opacity: 0, scale: 0.95, x: -60 * direction }"
            :transition="transition"
          >
            <NuxtImg
              format="webp"
              :src="picsum(item.id, large.width, large.height)"
              :alt="item.title"
              :width="large.width"
              :height="large.height"
              class="max-h-[70dvh] w-auto object-contain"
            />
          </Motion>
        </AnimatePresence>
      </div>

      <button
        v-for="nav in [
          { delta: -1, label: 'Previous photo', icon: 'lucide:chevron-left', side: 'left-3' },
          { delta: 1, label: 'Next photo', icon: 'lucide:chevron-right', side: 'right-3' },
        ]"
        :key="nav.delta"
        type="button"
        class="absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-zinc-900 shadow-lg transition-colors hover:bg-white dark:bg-zinc-900/90 dark:text-white dark:hover:bg-zinc-900"
        :class="nav.side"
        :aria-label="nav.label"
        @click="step(nav.delta)"
      >
        <Icon :name="nav.icon" class="size-5" />
      </button>
      <p class="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">Use ← → to browse, Esc to close.</p>
    </div>
  </UiModal>
</template>
