<script setup lang="ts">
import { Motion } from "motion-v";
import { NuxtLink } from "#components";
import { COLOR_CLASSES, type ThemeColor } from "~/utils/themeColors";

const props = withDefaults(
  defineProps<{
    variant?: "solid" | "outline" | "ghost";
    color?: ThemeColor;
    size?: "sm" | "md" | "lg";
    /** Internal route: renders a NuxtLink. */
    to?: string;
    /** External URL: renders an <a>. */
    href?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    /** Iconify names, e.g. "lucide:sparkles". */
    icon?: string;
    iconRight?: string;
    block?: boolean;
  }>(),
  {
    variant: "solid",
    color: "grape",
    size: "md",
    to: undefined,
    href: undefined,
    type: "button",
    icon: undefined,
    iconRight: undefined,
  },
);

const SIZE = {
  sm: "h-9 gap-1.5 px-4 text-sm",
  md: "h-11 gap-2 px-5 text-sm",
  lg: "h-14 gap-2.5 px-7 text-base",
} as const;
const ICON = { sm: "size-4", md: "size-4", lg: "size-5" } as const;

const inactive = computed(() => props.disabled || props.loading);

const tag = computed(() => (props.to ? NuxtLink : props.href ? "a" : "button"));
const tagAttrs = computed(() => {
  if (props.to || props.href) {
    const target = props.to ? { to: props.to } : { href: props.href };
    // Links can't be disabled natively: remove them from the tab order and announce it.
    return inactive.value ? { ...target, "aria-disabled": "true", tabindex: -1 } : target;
  }
  return { type: props.type, disabled: inactive.value };
});

const variantClass = computed(() => {
  const c = COLOR_CLASSES[props.color];
  if (props.variant === "solid") return [c.fill, !inactive.value && c.fillHover, "shadow-sm"];
  if (props.variant === "outline") return [c.outline, "border-2 bg-transparent", !inactive.value && c.tintHover];
  return [c.text, "bg-transparent", !inactive.value && c.tintHover];
});

const spring = { type: "spring" as const, stiffness: 400, damping: 17 };
</script>

<template>
  <Motion
    as-child
    :while-hover="inactive ? undefined : { scale: 1.04 }"
    :while-press="inactive ? undefined : { scale: 0.95 }"
    :transition="spring"
  >
    <component
      :is="tag"
      v-bind="tagAttrs"
      :aria-busy="loading || undefined"
      class="inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors select-none"
      :class="[
        SIZE[size],
        variantClass,
        block && 'w-full',
        inactive && 'cursor-not-allowed opacity-50',
        (to || href) && inactive && 'pointer-events-none',
      ]"
    >
      <Motion
        v-if="loading"
        as="span"
        class="inline-flex"
        :animate="{ rotate: 360 }"
        :transition="{ duration: 0.9, repeat: Infinity, ease: 'linear' }"
        aria-hidden="true"
      >
        <Icon name="lucide:loader-circle" :class="ICON[size]" />
      </Motion>
      <Icon v-else-if="icon" :name="icon" :class="ICON[size]" aria-hidden="true" />
      <slot />
      <Icon v-if="iconRight" :name="iconRight" :class="ICON[size]" aria-hidden="true" />
    </component>
  </Motion>
</template>
