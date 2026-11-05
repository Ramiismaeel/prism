<script setup lang="ts">
import { motion, useReducedMotion } from "motion-v";

const colorMode = useColorMode();
const reduceMotion = useReducedMotion();
const maskId = `moon-mask-${useId()}`;

const isDark = computed(() => colorMode.value === "dark");

function toggle() {
  colorMode.preference = isDark.value ? "light" : "dark";
}

const spring = computed(() =>
  reduceMotion.value
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 20 },
);

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      class="grid size-10 place-items-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="toggle"
    >
      <!-- Sun ↔ moon morph: the core grows, a masking circle slides in to carve the crescent,
           and the rays spin away. -->
      <motion.svg
        viewBox="0 0 24 24"
        class="pointer-events-none size-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
        :animate="{ rotate: isDark ? -30 : 0 }"
        :transition="spring"
      >
        <mask :id="maskId" stroke="none">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle
            r="9"
            fill="black"
            :initial="false"
            :animate="isDark ? { cx: 17, cy: 6 } : { cx: 32, cy: -8 }"
            :transition="spring"
          />
        </mask>
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          stroke="none"
          :mask="`url(#${maskId})`"
          :initial="false"
          :animate="{ r: isDark ? 9 : 5 }"
          :transition="spring"
        />
        <motion.g
          :initial="false"
          :animate="{ opacity: isDark ? 0 : 1, scale: isDark ? 0.4 : 1, rotate: isDark ? 90 : 0 }"
          :transition="spring"
          style="transform-origin: 12px 12px"
        >
          <line
            v-for="angle in RAY_ANGLES"
            :key="angle"
            x1="12"
            y1="2"
            x2="12"
            y2="4"
            :transform="`rotate(${angle} 12 12)`"
          />
        </motion.g>
      </motion.svg>
    </button>
    <template #fallback>
      <span class="block size-10" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>
