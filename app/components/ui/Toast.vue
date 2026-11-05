<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";
import type { ToastType } from "~/composables/useToast";

// The toast viewport: render once (default layout). Trigger toasts with useToast().
const { toasts, dismiss, pause, resume } = useToast();

const STYLE: Record<ToastType, { icon: string; color: string; bar: string }> = {
  success: { icon: "lucide:circle-check", color: "text-mint-ink dark:text-mint-glow", bar: "bg-mint" },
  error: { icon: "lucide:circle-x", color: "text-coral-ink dark:text-coral-glow", bar: "bg-coral" },
  info: { icon: "lucide:info", color: "text-sky-ink dark:text-sky-glow", bar: "bg-sky" },
  warning: { icon: "lucide:triangle-alert", color: "text-sun-ink dark:text-sun-glow", bar: "bg-sun" },
};

const reduceMotion = useReducedMotion();
const spring = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 32 },
);
</script>

<template>
  <section
    aria-label="Notifications"
    class="pointer-events-none fixed inset-x-0 bottom-0 z-60 flex justify-center p-4 sm:justify-end"
  >
    <!-- Persistent live region: new toasts inside it are announced politely. -->
    <AnimatePresence as="ol" aria-live="polite" class="flex w-full max-w-sm flex-col gap-2">
      <Motion
        v-for="t in toasts"
        :key="t.id"
        as="li"
        layout
        class="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 pl-5 shadow-xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40"
        :initial="{ opacity: 0, y: 24, scale: 0.95 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, x: 120, transition: { duration: reduceMotion ? 0 : 0.2 } }"
        :transition="spring"
        @pointerenter="pause(t.id)"
        @pointerleave="resume(t.id)"
        @focusin="pause(t.id)"
        @focusout="resume(t.id)"
      >
        <span class="absolute inset-y-0 left-0 w-1" :class="STYLE[t.type].bar" aria-hidden="true" />
        <Icon :name="STYLE[t.type].icon" class="mt-0.5 size-5 shrink-0" :class="STYLE[t.type].color" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold">
            <span class="sr-only">{{ t.type }}: </span>{{ t.title }}
          </p>
          <p v-if="t.description" class="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
            {{ t.description }}
          </p>
        </div>
        <button
          type="button"
          class="-m-1 grid size-7 shrink-0 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label="Dismiss notification"
          @click="dismiss(t.id)"
        >
          <Icon name="lucide:x" class="size-4" />
        </button>
      </Motion>
    </AnimatePresence>
  </section>
</template>
