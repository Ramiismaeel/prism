<script setup lang="ts">
import { Motion, useReducedMotion } from "motion-v";
import { COLOR_CLASSES, type ThemeColor } from "~/utils/themeColors";

const props = withDefaults(
  defineProps<{
    color?: ThemeColor;
    /** Seconds for one full drift loop. */
    duration?: number;
    delay?: number;
    /** How far (px) the blob drifts from its resting position. */
    drift?: number;
  }>(),
  { color: "grape", duration: 14, delay: 0, drift: 40 },
);

const keyframes = computed(() => {
  const d = props.drift;
  return {
    x: [0, d, -d * 0.6, d * 0.4, 0],
    y: [0, -d * 0.8, d * 0.5, d, 0],
    scale: [1, 1.12, 0.92, 1.05, 1],
    borderRadius: ["50%", "42% 58% 60% 40%", "58% 42% 38% 62%", "46% 54% 52% 48%", "50%"],
  };
});

// The same keyframes are always passed (so SSR matches); reduced motion makes the
// transition instant and unrepeated, which leaves the blob at rest.
const reduceMotion = useReducedMotion();
const transition = computed(() =>
  reduceMotion.value
    ? { duration: 0 }
    : {
        duration: props.duration,
        delay: props.delay,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
);
</script>

<template>
  <!-- Size and position come from the parent via class, e.g. class="size-72 -top-10 left-0". -->
  <Motion
    aria-hidden="true"
    class="pointer-events-none absolute rounded-full opacity-50 blur-3xl will-change-transform dark:opacity-45"
    :class="COLOR_CLASSES[color].bg"
    :animate="keyframes"
    :transition="transition"
  />
</template>
