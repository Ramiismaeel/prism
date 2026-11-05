<script setup lang="ts">
const model = defineModel<string>({ default: "" });

withDefaults(
  defineProps<{
    label: string;
    name: string;
    /** value → label */
    options: Record<string, string>;
    placeholder?: string;
    error?: string;
  }>(),
  { placeholder: "Choose…", error: undefined },
);

const id = useId();
const errorId = `${id}-error`;
</script>

<template>
  <div>
    <!-- Native <select>: best keyboard and screen-reader support; the label sits on top. -->
    <div class="relative">
      <select
        :id="id"
        v-model="model"
        :name="name"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        class="block w-full appearance-none rounded-2xl border-2 bg-white px-4 pt-6 pb-2 pr-12 text-base transition-colors outline-none focus:ring-4 dark:bg-zinc-900"
        :class="[
          model ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400',
          error
            ? 'border-coral-ink focus:ring-coral/20 dark:border-coral-glow'
            : 'border-zinc-300 focus:border-grape focus:ring-grape/20 dark:border-zinc-700 dark:focus:border-grape-glow',
        ]"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="(text, value) in options" :key="value" :value="value">{{ text }}</option>
      </select>
      <label :for="id" class="pointer-events-none absolute top-2 left-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {{ label }}
      </label>
      <Icon
        name="lucide:chevron-down"
        class="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-zinc-500"
        aria-hidden="true"
      />
    </div>
    <FormFieldError :id="errorId" :error="error" />
  </div>
</template>
