<script setup lang="ts">
import { AnimatePresence, Motion, useInView, useReducedMotion } from "motion-v";
import { testimonials } from "~/data/testimonials";
import { picsum } from "~/utils/picsum";
import { COLOR_CLASSES, type ThemeColor } from "~/utils/themeColors";

// Full class strings so Tailwind generates them.
const RING: Record<ThemeColor, string> = {
  grape: "ring-grape/30",
  coral: "ring-coral/30",
  sun: "ring-sun/30",
  mint: "ring-mint/30",
  sky: "ring-sky/30",
};

const AUTOPLAY_MS = 6000;
const SWIPE_PX = 60;

const index = ref(0);
const direction = ref(1); // +1 = next (slides in from the right), -1 = previous
const current = computed(() => testimonials[index.value]!);

function go(to: number, dir = to > index.value ? 1 : -1) {
  direction.value = dir;
  index.value = (to + testimonials.length) % testimonials.length;
}
const next = () => go(index.value + 1, 1);
const prev = () => go(index.value - 1, -1);

// Auto-play (WCAG 2.2.2): can be paused with a button, pauses while hovered, focused or
// off-screen, and never starts for reduced-motion users. `playing` drives rendered markup
// (aria-live, the pause button), so it is based on useMotionEnabled(), which is hydration-safe.
const reduceMotion = useReducedMotion();
const motionEnabled = useMotionEnabled();
const section = ref<HTMLElement | null>(null);
const inView = useInView(section, { amount: 0.4 });
const userPaused = ref(false);
const hovered = ref(false);
const focused = ref(false);
const interacting = computed(() => hovered.value || focused.value || !inView.value);
const playing = computed(() => !userPaused.value && motionEnabled.value);
let timer: ReturnType<typeof setInterval> | undefined;

function restart() {
  clearInterval(timer);
  if (playing.value && !interacting.value) timer = setInterval(next, AUTOPLAY_MS);
}
onMounted(() => watch([playing, interacting, index], restart, { immediate: true }));
onBeforeUnmount(() => clearInterval(timer));

function onDragEnd(_: PointerEvent, info: { offset: { x: number } }) {
  if (info.offset.x < -SWIPE_PX) next();
  else if (info.offset.x > SWIPE_PX) prev();
}

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d * 80, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (d: number) => ({ opacity: 0, x: d * -80, scale: 0.97 }),
};
const transition = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 30 },
);
</script>

<template>
  <section
    ref="section"
    class="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8"
    aria-roledescription="carousel"
    aria-labelledby="testimonials-title"
    @pointerenter="hovered = true"
    @pointerleave="hovered = false"
    @focusin="focused = true"
    @focusout="focused = false"
  >
    <div class="mb-12 text-center">
      <UiBadge color="sun" dot caps>Kind words</UiBadge>
      <h2 id="testimonials-title" class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Clients, glowing
      </h2>
    </div>

    <!-- Slides share one grid cell, so exit and enter overlap without a height jump. -->
    <div class="grid" :aria-live="playing ? 'off' : 'polite'">
      <AnimatePresence :initial="false" :custom="direction">
        <Motion
          :key="index"
          as="div"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${index + 1} of ${testimonials.length}`"
          class="col-start-1 row-start-1 cursor-grab touch-pan-y rounded-[2.5rem] border border-zinc-200 bg-white p-8 text-center shadow-xl shadow-zinc-900/5 select-none active:cursor-grabbing sm:p-12 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30"
          :custom="direction"
          :variants="slide"
          initial="enter"
          animate="center"
          exit="exit"
          :transition="transition"
          drag="x"
          :drag-constraints="{ left: 0, right: 0 }"
          :drag-elastic="0.4"
          @drag-end="onDragEnd"
        >
          <figure>
            <Icon
              name="lucide:quote"
              class="mx-auto mb-6 size-10"
              :class="COLOR_CLASSES[current.color].text"
              aria-hidden="true"
            />
            <blockquote class="font-display text-xl leading-relaxed font-medium sm:text-2xl">
              “{{ current.quote }}”
            </blockquote>
            <figcaption class="mt-8 flex items-center justify-center gap-4">
              <NuxtImg
                format="webp"
                :src="picsum(current.avatarSeed, 120, 120)"
                alt=""
                width="56"
                height="56"
                loading="lazy"
                draggable="false"
                class="size-14 rounded-full object-cover ring-4"
                :class="RING[current.color]"
              />
              <div class="text-left">
                <p class="font-semibold">{{ current.name }}</p>
                <p class="text-sm text-zinc-600 dark:text-zinc-400">{{ current.role }}</p>
              </div>
            </figcaption>
          </figure>
        </Motion>
      </AnimatePresence>
    </div>

    <SectionsTestimonialsControls
      :count="testimonials.length"
      :index="index"
      :playing="playing"
      :can-autoplay="motionEnabled"
      @prev="prev"
      @next="next"
      @go="go"
      @toggle-play="userPaused = !userPaused"
    />
  </section>
</template>
