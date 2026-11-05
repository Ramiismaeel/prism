<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";

const open = defineModel<boolean>("open", { required: true });

withDefaults(
  defineProps<{
    title: string;
    description?: string;
    /** Keep the title for screen readers but don't show it. */
    hideTitle?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    closeOnBackdrop?: boolean;
  }>(),
  { description: undefined, size: "md", closeOnBackdrop: true },
);

const SIZE = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-3xl", xl: "max-w-5xl" } as const;

const panel = ref<HTMLElement | null>(null);
const titleId = useId();
const descriptionId = useId();

function close() {
  open.value = false;
}

useFocusTrap(panel, open, close);
useScrollLock(open);

const reduceMotion = useReducedMotion();
const fade = computed(() => ({ duration: reduceMotion.value ? 0 : 0.2 }));
const pop = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 28 },
);
</script>

<template>
  <Teleport to="#teleports">
    <AnimatePresence>
      <Motion
        v-if="open"
        key="modal"
        as="div"
        class="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="fade"
      >
        <div
          class="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm"
          aria-hidden="true"
          @click="closeOnBackdrop && close()"
        />
        <Motion
          as="div"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="description ? descriptionId : undefined"
          class="relative w-full rounded-3xl bg-white shadow-2xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-white/10"
          :class="SIZE[size]"
          :initial="{ opacity: 0, scale: 0.9, y: 24 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95, y: 12 }"
          :transition="pop"
        >
          <div ref="panel" class="p-6 sm:p-8">
            <div class="mb-4 flex items-start justify-between gap-4" :class="hideTitle && 'sr-only'">
              <div>
                <h2 :id="titleId" class="text-2xl font-bold">{{ title }}</h2>
                <p v-if="description" :id="descriptionId" class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {{ description }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              aria-label="Close dialog"
              @click="close"
            >
              <Icon name="lucide:x" class="size-5" />
            </button>
            <slot :close="close" />
            <div v-if="$slots.footer" class="mt-8 flex flex-wrap justify-end gap-3">
              <slot name="footer" :close="close" />
            </div>
          </div>
        </Motion>
      </Motion>
    </AnimatePresence>
  </Teleport>
</template>
