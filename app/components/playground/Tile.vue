<script setup lang="ts">
defineProps<{
  title: string;
  /** How the demo works; shown in a tooltip on the info button. */
  how: string;
}>();
</script>

<template>
  <section
    class="flex min-h-72 min-w-0 flex-col rounded-3xl border border-zinc-200 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/60"
    :aria-label="title"
  >
    <header class="mb-4 flex items-center justify-between gap-2">
      <h3 class="font-semibold">{{ title }}</h3>
      <UiTooltip :text="how" placement="left">
        <button
          type="button"
          class="grid size-8 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          :aria-label="`How the ${title} demo works`"
        >
          <Icon name="lucide:info" class="size-4" />
        </button>
      </UiTooltip>
    </header>
    <div class="relative grid flex-1 place-items-center">
      <slot />
    </div>
  </section>
</template>
