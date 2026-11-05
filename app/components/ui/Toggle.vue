<script setup lang="ts">
import { Motion, useReducedMotion } from "motion-v";
import { COLOR_CLASSES, type ThemeColor } from "~/utils/themeColors";

const checked = defineModel<boolean>({ default: false });

withDefaults(
  defineProps<{
    /** Visible label. Use the default slot for richer content. */
    label?: string;
    /** Accessible name when there is no visible label. */
    srLabel?: string;
    color?: ThemeColor;
    disabled?: boolean;
  }>(),
  { label: undefined, srLabel: undefined, color: "grape" },
);

const reduceMotion = useReducedMotion();
const spring = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 600, damping: 32 },
);
</script>

<template>
  <!-- The <label> names the switch and makes the text clickable too. -->
  <label
    class="inline-flex items-center gap-3 select-none"
    :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
  >
    <button
      type="button"
      role="switch"
      :aria-checked="checked"
      :aria-label="label || $slots.default ? undefined : srLabel"
      :disabled="disabled"
      class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200"
      :class="checked ? COLOR_CLASSES[color].bg : 'bg-zinc-300 dark:bg-zinc-700'"
      @click="checked = !checked"
    >
      <Motion
        as="span"
        class="size-5 rounded-full bg-white shadow-md"
        :initial="false"
        :animate="{ x: checked ? 20 : 0 }"
        :transition="spring"
      />
    </button>
    <span v-if="label || $slots.default" class="text-sm font-medium">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
