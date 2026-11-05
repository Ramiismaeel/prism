<script setup lang="ts">
import { Motion, useReducedMotion } from "motion-v";

const props = defineProps<{ steps: string[]; current: number }>();

const reduceMotion = useReducedMotion();
const spring = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 160, damping: 24 },
);
// Track runs from the first bubble's center to the last's (each column is 1/n wide).
const inset = computed(() => `${50 / props.steps.length}%`);
const progress = computed(() => (props.steps.length > 1 ? props.current / (props.steps.length - 1) : 1));
</script>

<template>
  <div role="group" aria-label="Form progress" class="relative">
    <!-- Track + animated fill behind the step bubbles. -->
    <div class="absolute top-5 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" :style="{ left: inset, right: inset }" aria-hidden="true">
      <Motion
        class="h-full origin-left rounded-full bg-linear-to-r from-grape via-coral to-sun"
        :initial="false"
        :animate="{ scaleX: progress }"
        :transition="spring"
      />
    </div>
    <ol class="relative grid" :style="{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }">
      <li
        v-for="(step, i) in steps"
        :key="step"
        class="flex flex-col items-center gap-2 text-center"
        :aria-current="i === current ? 'step' : undefined"
      >
        <Motion
          as="span"
          class="grid size-10 place-items-center rounded-full border-2 font-display font-bold transition-colors"
          :class="
            i < current
              ? 'border-grape bg-grape text-white'
              : i === current
                ? 'border-grape bg-white text-grape-ink dark:bg-zinc-950 dark:text-grape-glow'
                : 'border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400'
          "
          :initial="false"
          :animate="{ scale: i === current ? 1.12 : 1 }"
          :transition="spring"
        >
          <Icon v-if="i < current" name="lucide:check" class="size-5" aria-hidden="true" />
          <span v-else aria-hidden="true">{{ i + 1 }}</span>
        </Motion>
        <span class="text-xs font-medium sm:text-sm" :class="i === current ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'">
          <span class="sr-only">Step {{ i + 1 }}: </span>{{ step }}<span v-if="i < current" class="sr-only"> (completed)</span>
        </span>
      </li>
    </ol>
  </div>
</template>
