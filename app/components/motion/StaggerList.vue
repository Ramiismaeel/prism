<script setup lang="ts" generic="T">
import { Motion, useReducedMotion } from "motion-v";
import type { MotionTag } from "~/types/motion";

const props = withDefaults(
  defineProps<{
    items: T[];
    /** List element and item element. */
    as?: MotionTag;
    itemAs?: MotionTag;
    /** Key for each item; defaults to its index. */
    itemKey?: (item: T, index: number) => string | number;
    /** Seconds between each child. */
    stagger?: number;
    delay?: number;
    /** Start offset in px for each item. */
    y?: number;
    once?: boolean;
    amount?: number;
    itemClass?: string;
  }>(),
  {
    as: "ul",
    itemAs: "li",
    itemKey: undefined,
    stagger: 0.08,
    delay: 0,
    y: 24,
    once: true,
    amount: 0.2,
    itemClass: undefined,
  },
);

defineSlots<{ default(props: { item: T; index: number }): unknown }>();

const reduceMotion = useReducedMotion();

// The parent only orchestrates: it passes "hidden"/"visible" down to every child.
const listVariants = computed(() => ({
  hidden: {},
  visible: {
    transition: reduceMotion.value
      ? {}
      : { staggerChildren: props.stagger, delayChildren: props.delay },
  },
}));

const itemVariants = computed(() => ({
  hidden: { opacity: 0, y: props.y, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: reduceMotion.value
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 260, damping: 24 },
  },
}));

const keyFor = (item: T, index: number) => props.itemKey?.(item, index) ?? index;
</script>

<template>
  <Motion
    :as="as"
    initial="hidden"
    while-in-view="visible"
    :in-view-options="{ once, amount }"
    :variants="listVariants"
  >
    <Motion
      v-for="(item, index) in items"
      :key="keyFor(item, index)"
      :as="itemAs"
      :variants="itemVariants"
      :class="itemClass"
    >
      <slot :item="item" :index="index" />
    </Motion>
  </Motion>
</template>
