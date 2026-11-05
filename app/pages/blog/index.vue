<script setup lang="ts">
import { sortedPosts } from "~/data/posts";

useSeoMeta({
  title: "Blog",
  description: "Notes from the spectrum: stories about color, motion, branding and making things glow.",
});
</script>

<template>
  <div>
    <SectionsPageHeader
      eyebrow="Blog"
      title="Notes from the spectrum"
      lead="Stories about color, motion and making things glow, straight from the studio floor."
      color="grape"
    >
      <template #aside>
        <UiIllustration
          name="hero"
          alt="A person sketching ideas surrounded by floating shapes"
          :width="520"
          :height="400"
          eager
          class="mx-auto w-full max-w-lg"
        />
      </template>
    </SectionsPageHeader>

    <section class="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8" aria-label="All posts">
      <MotionStaggerList
        v-slot="{ item }"
        :items="sortedPosts"
        :item-key="(p) => p.slug"
        :stagger="0.1"
        class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        item-class="h-full"
      >
        <BlogPostCard :post="item" />
      </MotionStaggerList>
    </section>
  </div>
</template>
