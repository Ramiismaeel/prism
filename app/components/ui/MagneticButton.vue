<script setup lang="ts">
import { Motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion-v";

const props = withDefaults(
  defineProps<{
    /** 0–1: how strongly the content is pulled toward the cursor. */
    strength?: number;
  }>(),
  { strength: 0.35 },
);

const reduceMotion = useReducedMotion();
const x = useMotionValue(0);
const y = useMotionValue(0);
const spring = { stiffness: 220, damping: 14, mass: 0.5 };
const springX = useSpring(x, spring);
const springY = useSpring(y, spring);
// The inner layer travels a little further, which gives the pull some depth.
const innerX = useTransform(springX, (v) => v * 0.35);
const innerY = useTransform(springY, (v) => v * 0.35);

// The outer field is measured (it never moves), so the pull doesn't feed back on itself.
function onMove(e: PointerEvent) {
  if (e.pointerType !== "mouse" || reduceMotion.value) return;
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  x.set((e.clientX - (rect.left + rect.width / 2)) * props.strength);
  y.set((e.clientY - (rect.top + rect.height / 2)) * props.strength);
}

function reset() {
  x.set(0);
  y.set(0);
}
</script>

<template>
  <!-- Padding widens the magnetic field around the content; negative margin keeps layout unchanged. -->
  <div class="-m-4 inline-block p-4" @pointermove="onMove" @pointerleave="reset">
    <Motion as="div" class="inline-block" :style="{ x: springX, y: springY }">
      <Motion as="div" class="inline-block" :style="{ x: innerX, y: innerY }">
        <slot />
      </Motion>
    </Motion>
  </div>
</template>
