<script setup lang="ts">
const model = defineModel<string>({ default: "" });

withDefaults(
  defineProps<{
    label: string;
    name: string;
    type?: "text" | "email" | "tel" | "url";
    error?: string;
    autocomplete?: string;
  }>(),
  { type: "text", error: undefined, autocomplete: undefined },
);

const id = useId();
const errorId = `${id}-error`;
</script>

<template>
  <div>
    <!-- Floating label: the placeholder is a single space, so `placeholder-shown` means "empty". -->
    <div class="relative">
      <input
        :id="id"
        v-model="model"
        :name="name"
        :type="type"
        :autocomplete="autocomplete"
        placeholder=" "
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        class="peer block w-full rounded-2xl border-2 bg-white px-4 pt-6 pb-2 text-base text-zinc-900 transition-colors outline-none focus:ring-4 dark:bg-zinc-900 dark:text-white"
        :class="
          error
            ? 'border-coral-ink focus:ring-coral/20 dark:border-coral-glow'
            : 'border-zinc-300 focus:border-grape focus:ring-grape/20 dark:border-zinc-700 dark:focus:border-grape-glow'
        "
      >
      <label
        :for="id"
        class="pointer-events-none absolute top-2 left-4 text-xs font-medium text-zinc-600 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs dark:text-zinc-400"
      >
        {{ label }}
      </label>
    </div>
    <FormFieldError :id="errorId" :error="error" />
  </div>
</template>
