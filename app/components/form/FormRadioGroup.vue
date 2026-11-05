<script setup lang="ts">
const model = defineModel<string>({ default: "" });

withDefaults(
  defineProps<{
    legend: string;
    name: string;
    /** value → label */
    options: Record<string, string>;
    error?: string;
  }>(),
  { error: undefined },
);

const id = useId();
const errorId = `${id}-error`;
</script>

<template>
  <!-- Real radios (visually hidden) inside styled cards: arrow keys work natively. -->
  <fieldset :aria-describedby="error ? errorId : undefined">
    <legend class="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ legend }}</legend>
    <div class="grid grid-cols-2 gap-3">
      <label
        v-for="(text, value) in options"
        :key="value"
        class="relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-medium transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-grape/30"
        :class="
          model === value
            ? 'border-grape bg-grape/10 text-grape-ink dark:border-grape-glow dark:bg-grape/20 dark:text-grape-glow'
            : error
              ? 'border-coral-ink dark:border-coral-glow'
              : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500'
        "
      >
        <input
          v-model="model"
          type="radio"
          :name="name"
          :value="value"
          :aria-invalid="!!error"
          class="peer sr-only"
        >
        <span
          class="grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors"
          :class="model === value ? 'border-grape dark:border-grape-glow' : 'border-zinc-400'"
          aria-hidden="true"
        >
          <span v-if="model === value" class="size-2.5 rounded-full bg-grape dark:bg-grape-glow" />
        </span>
        {{ text }}
      </label>
    </div>
    <FormFieldError :id="errorId" :error="error" />
  </fieldset>
</template>
