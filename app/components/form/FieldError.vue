<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";

defineProps<{ id: string; error?: string }>();

const reduceMotion = useReducedMotion();
</script>

<template>
  <!-- Inline error text, linked to its field via aria-describedby. -->
  <AnimatePresence :initial="false">
    <Motion
      v-if="error"
      :id="id"
      as="p"
      class="mt-2 flex items-start gap-1.5 text-sm font-medium text-coral-ink dark:text-coral-glow"
      :initial="{ opacity: 0, y: -4 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -4 }"
      :transition="{ duration: reduceMotion ? 0 : 0.2 }"
    >
      <Icon name="lucide:circle-alert" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {{ error }}
    </Motion>
  </AnimatePresence>
</template>
