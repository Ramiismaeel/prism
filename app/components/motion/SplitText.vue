<script setup lang="ts">
import { Motion, useReducedMotion } from "motion-v";
import type { MotionTag } from "~/types/motion";

const props = withDefaults(
  defineProps<{
    text: string;
    /** Animate each word or each character. */
    by?: "word" | "char";
    as?: MotionTag;
    stagger?: number;
    delay?: number;
    once?: boolean;
  }>(),
  { by: "word", as: "span", stagger: undefined, delay: 0, once: true },
);

// Don't put `.text-prism` (background-clip: text) on this component: every animated unit is
// its own stacking context, so it escapes the parent's text clip and renders invisible.
// Use a solid color utility instead.
// Each word stays on one line (inline-block, nowrap); in "char" mode its letters animate one by one.
const words = computed(() =>
  props.text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (props.by === "char" ? Array.from(word) : [word])),
);

const reduceMotion = useReducedMotion();
const step = computed(() => props.stagger ?? (props.by === "char" ? 0.03 : 0.08));

const containerVariants = computed(() => ({
  hidden: {},
  visible: {
    transition: reduceMotion.value
      ? {}
      : { staggerChildren: step.value, delayChildren: props.delay },
  },
}));

const unitVariants = computed(() => ({
  hidden: { opacity: 0, y: "0.5em", rotate: 6, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: "0em",
    rotate: 0,
    filter: "blur(0px)",
    transition: reduceMotion.value
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 300, damping: 22 },
  },
}));
</script>

<template>
  <Motion
    :as="as"
    initial="hidden"
    while-in-view="visible"
    :in-view-options="{ once, amount: 0.5 }"
    :variants="containerVariants"
  >
    <!-- Screen readers get the plain sentence; the split spans are visual only. -->
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">
      <template v-for="(units, w) in words" :key="w">
        <span class="inline-block whitespace-nowrap">
          <Motion
            v-for="(unit, u) in units"
            :key="u"
            as="span"
            class="inline-block will-change-transform"
            :variants="unitVariants"
          >
            {{ unit }}
          </Motion>
        </span>
        {{ " " }}
      </template>
    </span>
  </Motion>
</template>
