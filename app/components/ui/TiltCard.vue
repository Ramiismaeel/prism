<script setup lang="ts">
import {
  Motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion-v";

const props = withDefaults(
  defineProps<{
    /** Maximum tilt in degrees. */
    maxTilt?: number;
    /** Light reflection that follows the cursor. */
    glare?: boolean;
  }>(),
  { maxTilt: 12, glare: true },
);

const reduceMotion = useReducedMotion();

// Pointer position over the card, 0–1 on each axis (0.5 = center = flat).
const px = useMotionValue(0.5);
const py = useMotionValue(0.5);
const spring = { stiffness: 180, damping: 18 };

const rotateX = useSpring(useTransform(py, [0, 1], [props.maxTilt, -props.maxTilt]), spring);
const rotateY = useSpring(useTransform(px, [0, 1], [-props.maxTilt, props.maxTilt]), spring);
const scale = useSpring(1, spring);

const glareX = useTransform(px, (v) => v * 100);
const glareY = useTransform(py, (v) => v * 100);
const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.45), transparent 60%)`;
const glareOpacity = useSpring(0, spring);

// Measured on the outer wrapper, which never moves, so the tilt doesn't skew the math.
function onMove(e: PointerEvent) {
  if (e.pointerType !== "mouse" || reduceMotion.value) return;
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  px.set((e.clientX - rect.left) / rect.width);
  py.set((e.clientY - rect.top) / rect.height);
  scale.set(1.03);
  glareOpacity.set(1);
}

function reset() {
  px.set(0.5);
  py.set(0.5);
  scale.set(1);
  glareOpacity.set(0);
}
</script>

<template>
  <div class="perspective-[900px]" @pointermove="onMove" @pointerleave="reset">
    <Motion
      as="div"
      class="relative h-full rounded-3xl transform-3d"
      :style="{ rotateX, rotateY, scale }"
    >
      <slot />
      <Motion
        v-if="glare"
        as="div"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
        :style="{ background: glareBackground, opacity: glareOpacity }"
      />
    </Motion>
  </div>
</template>
