<script setup lang="ts">
import { Motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion-v";
import { timeline } from "~/data/about";
import { COLOR_CLASSES } from "~/utils/themeColors";

const track = ref<HTMLElement | null>(null);

// 0 when the list's top reaches 75% down the viewport, 1 when its bottom reaches 55%.
const { scrollYProgress } = useScroll({ target: track, offset: ["start 75%", "end 55%"] });
const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

// Reduced motion: show the full line instead of growing it. `full` is set after mount,
// so SSR and hydration render the same thing (see useMotionEnabled for the same idea).
const reduceMotion = useReducedMotion();
const full = useMotionValue(0);
onMounted(() => watch(reduceMotion, (r) => full.set(r ? 1 : 0), { immediate: true }));
const scaleY = useTransform([progress, full], ([p, f]: number[]) => Math.max(p ?? 0, f ?? 0));
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="timeline-title">
    <div class="mb-14 text-center">
      <UiBadge color="sun" dot caps>Our story</UiBadge>
      <h2 id="timeline-title" class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">How the light got in</h2>
    </div>

    <div ref="track" class="relative">
      <!-- The line that grows with scroll. Left on mobile, centered from md up. -->
      <div class="absolute top-0 bottom-0 left-4 w-1 -translate-x-1/2 rounded-full bg-zinc-200 md:left-1/2 dark:bg-zinc-800" aria-hidden="true">
        <Motion
          class="h-full w-full origin-top rounded-full bg-linear-to-b from-grape via-coral to-sky"
          :style="{ scaleY }"
        />
      </div>
      <ol class="relative space-y-12">
        <li
          v-for="(m, i) in timeline"
          :key="m.year"
          class="relative pl-12 md:w-1/2 md:pl-0"
          :class="i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'"
        >
          <span
            class="absolute top-1.5 left-4 size-4 -translate-x-1/2 rounded-full ring-4 ring-white dark:ring-zinc-950"
            :class="[COLOR_CLASSES[m.color].bg, i % 2 === 0 ? 'md:right-0 md:left-auto md:translate-x-1/2' : 'md:left-0']"
            aria-hidden="true"
          />
          <MotionReveal :x="i % 2 === 0 ? -60 : 60" :y="0" :amount="0.5">
            <time :datetime="String(m.year)" class="font-display text-sm font-bold" :class="COLOR_CLASSES[m.color].text">
              {{ m.year }}
            </time>
            <h3 class="mt-1 text-xl font-semibold">{{ m.title }}</h3>
            <p class="mt-2 text-zinc-600 dark:text-zinc-400">{{ m.text }}</p>
          </MotionReveal>
        </li>
      </ol>
    </div>
  </section>
</template>
