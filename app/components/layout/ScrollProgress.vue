<script setup lang="ts">
import { Motion, useReducedMotion, useScroll, useSpring } from "motion-v";

const { scrollYProgress } = useScroll();
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 200,
  damping: 30,
  restDelta: 0.001,
});

// The bar is information, not decoration, so reduced motion keeps it but drops the spring.
const reduceMotion = useReducedMotion();
const scaleX = computed(() => (reduceMotion.value ? scrollYProgress : smoothProgress));
</script>

<template>
  <Motion
    aria-hidden="true"
    class="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 origin-left bg-linear-to-r from-grape via-coral to-sky"
    :style="{ scaleX }"
  />
</template>
