<script setup lang="ts">
const route = useRoute();
const slug = computed(() => String(route.params.slug));

useSeoMeta({ title: () => slug.value });
</script>

<template>
  <article class="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
    <NuxtLink
      to="/blog"
      class="mb-6 inline-flex items-center gap-1 text-sm font-medium text-grape dark:text-grape-glow"
    >
      <Icon name="lucide:arrow-left" class="size-4" /> All posts
    </NuxtLink>
    <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">{{ slug }}</h1>
    <p class="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
      Article placeholder — real posts arrive in Phase 6.
    </p>
  </article>
</template>
