<script setup lang="ts">
import { Motion } from "motion-v";

// useMotionEnabled (not useReducedMotion): this drives rendered output, so it must match SSR on hydration.
const motionEnabled = useMotionEnabled();
const paused = ref(false);
const running = computed(() => !paused.value && motionEnabled.value);

const keyframes = {
  borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 60% 40% / 70% 50% 50% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
  rotate: [0, 90, 180, 360],
  backgroundColor: ["#7c3aed", "#f43f5e", "#0ea5e9", "#7c3aed"],
};
</script>

<template>
  <PlaygroundTile title="Morphing shape" how="Keyframes on border-radius, rotate and background color, looping forever. Pause stops it (it never runs with reduced motion).">
    <div class="flex flex-col items-center gap-5">
      <Motion
        class="size-36 shadow-xl"
        :initial="false"
        :animate="running ? keyframes : { rotate: 0 }"
        :transition="running ? { duration: 8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }"
        :style="running ? undefined : { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', backgroundColor: '#7c3aed' }"
        aria-hidden="true"
      />
      <UiBaseButton size="sm" variant="outline" :icon="paused ? 'lucide:play' : 'lucide:pause'" @click="paused = !paused">
        {{ paused ? "Play" : "Pause" }}
      </UiBaseButton>
    </div>
  </PlaygroundTile>
</template>
