<script setup lang="ts">
import { Motion, useReducedMotion } from "motion-v";

defineProps<{ name: string }>();
defineEmits<{ reset: [] }>();

const heading = ref<HTMLElement | null>(null);
onMounted(() => heading.value?.focus()); // announce the confirmation

const reduceMotion = useReducedMotion();
const draw = (delay: number) => ({ duration: reduceMotion.value ? 0 : 0.6, delay: reduceMotion.value ? 0 : delay, ease: "easeOut" as const });
</script>

<template>
  <div class="text-center">
    <!-- Animated checkmark: the circle, then the tick, draw themselves. -->
    <svg viewBox="0 0 96 96" class="mx-auto size-24 text-mint" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <Motion as="circle" cx="48" cy="48" r="42" :initial="{ pathLength: 0 }" :animate="{ pathLength: 1 }" :transition="draw(0)" />
      <Motion as="path" d="M30 49l12 12 25-26" :initial="{ pathLength: 0 }" :animate="{ pathLength: 1 }" :transition="draw(0.45)" />
    </svg>
    <h2 ref="heading" tabindex="-1" class="mt-6 text-3xl font-bold outline-none">Message sent!</h2>
    <p class="mx-auto mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
      Thanks{{ name ? `, ${name}` : "" }}. We'll get back to you within a day with a plan, a palette and probably a few exclamation marks.
    </p>
    <MotionReveal :delay="0.6" :y="20">
      <UiIllustration name="success" alt="A person celebrating a completed task" :width="400" :height="300" class="mx-auto mt-8 w-full max-w-xs" />
    </MotionReveal>
    <UiBaseButton variant="outline" class="mt-8" icon="lucide:rotate-ccw" @click="$emit('reset')">Send another message</UiBaseButton>
  </div>
</template>
