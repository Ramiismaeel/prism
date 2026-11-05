<script setup lang="ts">
import { Motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion-v";

const tile = ref<HTMLElement | null>(null);
// 0 → 1 while the tile travels from the bottom of the viewport to the top.
const { scrollYProgress } = useScroll({ target: tile, offset: ["start end", "end start"] });

// Strength is set after mount (0 with reduced motion), so SSR and hydration render no rotation.
const reduceMotion = useReducedMotion();
const strength = useMotionValue(0);
onMounted(() => watch(reduceMotion, (r) => strength.set(r ? 0 : 1), { immediate: true }));
const rotate = useTransform([scrollYProgress, strength], ([p, s]: number[]) => (p ?? 0) * 540 * (s ?? 0));
const scale = useTransform([scrollYProgress, strength], ([p, s]: number[]) => 1 - Math.sin((p ?? 0) * Math.PI) * 0.25 * (s ?? 0));
</script>

<template>
  <PlaygroundTile title="Scroll to spin" how="useScroll tracks this tile crossing the viewport; useTransform maps that progress to rotation and scale. Scroll the page to spin it.">
    <div ref="tile" class="grid place-items-center">
      <Motion class="grid size-28 place-items-center" :style="{ rotate, scale }" aria-hidden="true">
        <svg viewBox="0 0 100 100" class="size-full">
          <defs>
            <linearGradient id="spin-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#7c3aed" />
              <stop offset="50%" stop-color="#f43f5e" />
              <stop offset="100%" stop-color="#f59e0b" />
            </linearGradient>
          </defs>
          <polygon points="50,6 94,82 6,82" fill="url(#spin-gradient)" />
          <circle cx="50" cy="58" r="10" fill="white" opacity="0.85" />
        </svg>
      </Motion>
    </div>
  </PlaygroundTile>
</template>
