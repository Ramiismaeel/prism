<script setup lang="ts">
import { Motion, useReducedMotion } from "motion-v";
import type { MotionTag } from "~/types/motion";
import { COLOR_CLASSES, type ThemeColor } from "~/utils/themeColors";

withDefaults(
  defineProps<{
    as?: MotionTag;
    /** Lifts on hover with a spring (use for clickable cards). */
    interactive?: boolean;
    /** Colored strip along the top edge. */
    accent?: ThemeColor;
    /** Inner padding around the default slot. */
    padded?: boolean;
  }>(),
  { as: "div", accent: undefined, padded: true },
);

const reduceMotion = useReducedMotion();
const spring = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 20 },
);
</script>

<template>
  <Motion
    :as="as"
    class="relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    :class="
      interactive &&
      'transition-shadow duration-300 hover:shadow-xl hover:shadow-zinc-900/10 dark:hover:shadow-black/40'
    "
    :while-hover="interactive ? { y: -6 } : undefined"
    :transition="spring"
  >
    <span
      v-if="accent"
      class="absolute inset-x-0 top-0 z-10 h-1"
      :class="COLOR_CLASSES[accent].bg"
      aria-hidden="true"
    />
    <!-- Full-bleed media (image, illustration) above the padded body. -->
    <slot name="media" />
    <div class="flex-1" :class="padded && 'p-6'">
      <slot />
    </div>
  </Motion>
</template>
