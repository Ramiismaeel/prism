<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";

const props = withDefaults(
  defineProps<{
    text: string;
    placement?: "top" | "bottom" | "left" | "right";
    /** Hover delay in ms (focus shows immediately). */
    delay?: number;
  }>(),
  { placement: "top", delay: 150 },
);

const PLACEMENT = {
  top: { class: "bottom-full left-1/2 mb-2 -translate-x-1/2", from: { y: 6 } },
  bottom: { class: "top-full left-1/2 mt-2 -translate-x-1/2", from: { y: -6 } },
  left: { class: "right-full top-1/2 mr-2 -translate-y-1/2", from: { x: 6 } },
  right: { class: "left-full top-1/2 ml-2 -translate-y-1/2", from: { x: -6 } },
} as const;

const open = ref(false);
const id = useId();
const wrapper = ref<HTMLElement | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;

function show(delay = props.delay) {
  clearTimeout(timer);
  timer = setTimeout(() => (open.value = true), delay);
}
function hide() {
  clearTimeout(timer);
  open.value = false;
}

// The trigger is slot content, so link it to the always-present description after mount.
onMounted(() => {
  const trigger = wrapper.value?.querySelector<HTMLElement>(
    "a[href], button, input, select, textarea, [tabindex]",
  );
  if (!trigger) return;
  const existing = trigger.getAttribute("aria-describedby");
  trigger.setAttribute("aria-describedby", existing ? `${existing} ${id}` : id);
});
onBeforeUnmount(() => clearTimeout(timer));

const reduceMotion = useReducedMotion();
const transition = computed(() => ({ duration: reduceMotion.value ? 0 : 0.15 }));
</script>

<template>
  <span
    ref="wrapper"
    class="relative inline-flex"
    @pointerenter="show()"
    @pointerleave="hide"
    @focusin="show(0)"
    @focusout="hide"
    @keydown.esc="hide"
  >
    <slot />
    <span :id="id" class="sr-only">{{ text }}</span>
    <AnimatePresence>
      <Motion
        v-if="open"
        as="span"
        aria-hidden="true"
        class="pointer-events-none absolute z-50 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-lg dark:bg-white dark:text-zinc-900"
        :class="PLACEMENT[placement].class"
        :initial="{ opacity: 0, scale: 0.9, ...PLACEMENT[placement].from }"
        :animate="{ opacity: 1, scale: 1, x: 0, y: 0 }"
        :exit="{ opacity: 0, scale: 0.95 }"
        :transition="transition"
      >
        {{ text }}
      </Motion>
    </AnimatePresence>
  </span>
</template>
