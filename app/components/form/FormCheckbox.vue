<script setup lang="ts">
import { Motion, useReducedMotion } from "motion-v";

const checked = defineModel<boolean>({ default: false });

withDefaults(defineProps<{ name: string; error?: string }>(), { error: undefined });

const id = useId();
const errorId = `${id}-error`;
const reduceMotion = useReducedMotion();
</script>

<template>
  <div>
    <label :for="id" class="group flex cursor-pointer items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
      <input
        :id="id"
        v-model="checked"
        type="checkbox"
        :name="name"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        class="peer sr-only"
      >
      <!-- Visual box; the tick draws itself (SVG pathLength). -->
      <span
        class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border-2 transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-grape/30"
        :class="
          checked
            ? 'border-grape bg-grape dark:border-grape-glow dark:bg-grape'
            : error
              ? 'border-coral-ink dark:border-coral-glow'
              : 'border-zinc-400 group-hover:border-zinc-500'
        "
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" class="size-4 text-white" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
          <Motion
            as="path"
            d="M5 12.5l4.5 4.5L19 7.5"
            :initial="false"
            :animate="{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }"
            :transition="{ duration: reduceMotion ? 0 : 0.25 }"
          />
        </svg>
      </span>
      <span><slot /></span>
    </label>
    <FormFieldError :id="errorId" :error="error" />
  </div>
</template>
