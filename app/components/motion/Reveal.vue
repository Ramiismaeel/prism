<script setup lang="ts">
import { Motion, useReducedMotion } from "motion-v";
import type { MotionTag } from "~/types/motion";

const props = withDefaults(
  defineProps<{
    /** Element to render. */
    as?: MotionTag;
    delay?: number;
    duration?: number;
    /** Start offset in px; content slides from here to 0. */
    y?: number;
    x?: number;
    /** Only animate the first time it enters the viewport. */
    once?: boolean;
    /** Fraction of the element that must be visible to trigger. */
    amount?: number;
  }>(),
  { as: "div", delay: 0, duration: 0.6, y: 30, x: 0, once: true, amount: 0.3 },
);

// Reduced motion only changes the transition, never the rendered initial state,
// so the SSR markup and the first client render always match.
const reduceMotion = useReducedMotion();
const transition = computed(() =>
  reduceMotion.value
    ? { duration: 0 }
    : { duration: props.duration, delay: props.delay, ease: "easeOut" as const },
);
</script>

<template>
  <Motion
    :as="as"
    :initial="{ opacity: 0, y, x }"
    :while-in-view="{ opacity: 1, y: 0, x: 0 }"
    :in-view-options="{ once, amount }"
    :transition="transition"
  >
    <slot />
  </Motion>
</template>
