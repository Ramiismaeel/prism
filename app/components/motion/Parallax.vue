<script setup lang="ts">
import { Motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion-v";

const props = withDefaults(
  defineProps<{
    /**
     * Max travel in px while the element crosses the viewport.
     * Positive moves slower than the page (background feel), negative moves faster.
     */
    offset?: number;
    /** Smooth the motion with a spring. */
    smooth?: boolean;
  }>(),
  { offset: 80, smooth: true },
);

const container = ref<HTMLElement | null>(null);

// 0 when the element's top enters the bottom of the viewport, 1 when its bottom leaves the top.
const { scrollYProgress } = useScroll({
  target: container,
  offset: ["start end", "end start"],
});

// `strength` stays 0 until mounted, so SSR and hydration render no transform.
// After mount it is 1, or 0 if the user prefers reduced motion.
const reduceMotion = useReducedMotion();
const strength = useMotionValue(0);
onMounted(() => {
  watch(reduceMotion, (reduce) => strength.set(reduce ? 0 : 1), { immediate: true });
});

const rawY = useTransform(
  [scrollYProgress, strength],
  ([progress, s]: number[]) => (0.5 - (progress ?? 0)) * 2 * props.offset * (s ?? 0),
);
const springY = useSpring(rawY, { stiffness: 120, damping: 26, mass: 0.4 });
const y = computed(() => (props.smooth ? springY : rawY));
</script>

<template>
  <div ref="container" class="relative">
    <Motion :style="{ y }" class="will-change-transform">
      <slot />
    </Motion>
  </div>
</template>
