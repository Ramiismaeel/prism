<script setup lang="ts">
import { COLOR_CLASSES, type ThemeColor } from "~/utils/themeColors";

const props = withDefaults(
  defineProps<{
    color?: ThemeColor;
    variant?: "soft" | "solid" | "outline";
    /** Small colored dot before the label. */
    dot?: boolean;
    icon?: string;
    /** Uppercase, letter-spaced eyebrow style. */
    caps?: boolean;
  }>(),
  { color: "grape", variant: "soft", icon: undefined },
);

const variantClass = computed(() => {
  const c = COLOR_CLASSES[props.color];
  if (props.variant === "solid") return c.fill;
  if (props.variant === "outline") return [c.outline, "border"];
  return c.soft;
});
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
    :class="[variantClass, caps && 'tracking-widest uppercase']"
  >
    <span
      v-if="dot"
      class="size-2 rounded-full"
      :class="variant === 'solid' ? 'bg-current' : COLOR_CLASSES[color].bg"
      aria-hidden="true"
    />
    <Icon v-if="icon" :name="icon" class="size-3.5" aria-hidden="true" />
    <slot />
  </span>
</template>
