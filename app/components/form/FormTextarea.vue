<script setup lang="ts">
const model = defineModel<string>({ default: "" });

withDefaults(
  defineProps<{
    label: string;
    name: string;
    error?: string;
    rows?: number;
    /** Shows a character counter. */
    maxlength?: number;
  }>(),
  { error: undefined, rows: 5, maxlength: undefined },
);

const id = useId();
const errorId = `${id}-error`;
const counterId = `${id}-counter`;
</script>

<template>
  <div>
    <div class="relative">
      <textarea
        :id="id"
        v-model="model"
        :name="name"
        :rows="rows"
        :maxlength="maxlength"
        placeholder=" "
        :aria-invalid="!!error"
        :aria-describedby="[error && errorId, maxlength && counterId].filter(Boolean).join(' ') || undefined"
        class="peer block w-full resize-y rounded-2xl border-2 bg-white px-4 pt-7 pb-3 text-base text-zinc-900 transition-colors outline-none focus:ring-4 dark:bg-zinc-900 dark:text-white"
        :class="
          error
            ? 'border-coral-ink focus:ring-coral/20 dark:border-coral-glow'
            : 'border-zinc-300 focus:border-grape focus:ring-grape/20 dark:border-zinc-700 dark:focus:border-grape-glow'
        "
      />
      <label
        :for="id"
        class="pointer-events-none absolute top-2 left-4 text-xs font-medium text-zinc-600 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs dark:text-zinc-400"
      >
        {{ label }}
      </label>
    </div>
    <div class="flex items-start justify-between gap-4">
      <FormFieldError :id="errorId" :error="error" />
      <p v-if="maxlength" :id="counterId" class="mt-2 ml-auto shrink-0 text-xs text-zinc-600 tabular-nums dark:text-zinc-400">
        {{ model.length }} / {{ maxlength }}
      </p>
    </div>
  </div>
</template>
