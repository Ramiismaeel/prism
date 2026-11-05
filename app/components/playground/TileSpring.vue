<script setup lang="ts">
import { Motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion-v";

const value = ref(20);
const stiffness = ref(180);
const target = useMotionValue(20);
watch(value, (v) => target.set(v));

// Re-created when stiffness changes so the new physics apply.
const reduceMotion = useReducedMotion();
const config = computed(() =>
  reduceMotion.value ? { stiffness: 1000, damping: 100 } : { stiffness: stiffness.value, damping: 8 },
);
const spring = useSpring(target, config);
const left = useTransform(spring, (v) => `${v}%`);
</script>

<template>
  <PlaygroundTile title="Spring slider" how="useSpring follows the slider value; low damping makes it overshoot and wobble. Stiffness changes how eager the spring is.">
    <div class="w-full space-y-6">
      <div class="relative h-14 rounded-full bg-zinc-200 dark:bg-zinc-800" aria-hidden="true">
        <Motion
          class="absolute top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-135 from-mint to-sky shadow-lg"
          :style="{ left }"
        />
      </div>
      <label class="block text-sm font-medium">
        Position: {{ value }}%
        <input v-model.number="value" type="range" min="8" max="92" class="mt-2 w-full accent-grape">
      </label>
      <label class="block text-sm font-medium">
        Stiffness: {{ stiffness }}
        <input v-model.number="stiffness" type="range" min="40" max="600" step="20" class="mt-2 w-full accent-coral">
      </label>
    </div>
  </PlaygroundTile>
</template>
