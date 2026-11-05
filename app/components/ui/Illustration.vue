<script setup lang="ts">
const props = defineProps<{
  /** File name in public/illustrations without extension, e.g. "cta". */
  name: string;
  alt: string;
  width: number;
  height: number;
  /** Load immediately (above the fold). */
  eager?: boolean;
}>();

// The list of files is read from public/illustrations at build/dev start (nuxt.config.ts),
// so a missing file renders the placeholder straight away: no request, no 404, no flicker.
const { illustrations } = useRuntimeConfig().public;
const failed = ref(false);
const available = computed(() => illustrations.includes(props.name) && !failed.value);
</script>

<template>
  <div class="relative" :style="{ aspectRatio: `${width} / ${height}` }">
    <img
      v-if="available"
      :src="`/illustrations/${name}.svg`"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="eager ? 'eager' : 'lazy'"
      class="h-full w-full object-contain"
      @error="failed = true"
    >
    <!-- Placeholder until the real unDraw file is added (see PROJECT_PLAN.md §9). -->
    <div
      v-else
      role="img"
      :aria-label="alt"
      class="grid h-full w-full place-items-center rounded-3xl border-2 border-dashed border-grape/40 bg-white/50 p-4 text-center dark:border-grape-glow/30 dark:bg-zinc-950/30"
    >
      <div class="space-y-2" aria-hidden="true">
        <Icon name="lucide:image-plus" class="mx-auto size-8 text-grape-ink dark:text-grape-glow" />
        <p class="font-mono text-xs font-semibold text-grape-ink dark:text-grape-glow">
          illustrations/{{ name }}.svg
        </p>
        <p class="text-xs text-zinc-700 dark:text-zinc-300">Add from undraw.co (accent #7c3aed)</p>
      </div>
    </div>
  </div>
</template>
