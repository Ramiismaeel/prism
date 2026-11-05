<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    /** Show a Replay button that remounts the demo (for run-once animations). */
    replay?: boolean;
  }>(),
  { description: undefined, replay: false },
);

const runKey = ref(0);
</script>

<template>
  <section
    class="min-w-0 rounded-3xl border border-zinc-200 bg-zinc-50/60 p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60"
  >
    <header class="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 class="text-xl font-semibold">{{ title }}</h3>
        <p v-if="description" class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {{ description }}
        </p>
      </div>
      <button
        v-if="replay"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-grape hover:text-grape dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-grape-glow dark:hover:text-grape-glow"
        @click="runKey++"
      >
        <Icon name="lucide:rotate-ccw" class="size-3.5" aria-hidden="true" /> Replay
        <span class="sr-only">{{ title }} demo</span>
      </button>
    </header>
    <div :key="runKey">
      <slot />
    </div>
  </section>
</template>
