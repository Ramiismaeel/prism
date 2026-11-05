<script setup lang="ts">
import { formatDate, readingMinutes, TAG_COLOR, type Post } from "~/data/posts";
import { picsum } from "~/utils/picsum";

withDefaults(
  defineProps<{
    post: Post;
    /** Hide the excerpt (related posts). */
    compact?: boolean;
    headingLevel?: 2 | 3;
  }>(),
  { compact: false, headingLevel: 2 },
);
</script>

<template>
  <!-- One stretched link (the title) makes the whole card clickable without a pile of duplicate
       links for screen readers. The card shows the focus ring when that link is focused. -->
  <UiCard
    as="article"
    interactive
    class="group h-full ring-offset-4 ring-offset-white has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-grape dark:ring-offset-zinc-950 dark:has-[a:focus-visible]:ring-sky"
  >
    <template #media>
      <div class="overflow-hidden">
        <!-- Covers are random Picsum scenes: decorative, the title says what the post is about. -->
        <NuxtImg
          format="webp"
          :src="picsum(post.coverSeed, 1200, 800)"
          alt=""
          width="600"
          height="400"
          sizes="100vw sm:50vw lg:400px"
          loading="lazy"
          class="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>
    </template>
    <div class="flex flex-wrap gap-2">
      <UiBadge v-for="tag in post.tags" :key="tag" :color="TAG_COLOR[tag] ?? 'grape'">{{ tag }}</UiBadge>
    </div>
    <component :is="`h${headingLevel}`" class="mt-4 text-xl leading-snug font-semibold">
      <NuxtLink :to="`/blog/${post.slug}`" class="after:absolute after:inset-0 focus-visible:outline-none">
        {{ post.title }}
      </NuxtLink>
    </component>
    <p v-if="!compact" class="mt-2 text-zinc-600 dark:text-zinc-400">{{ post.excerpt }}</p>
    <p class="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
      <time :datetime="post.date">{{ formatDate(post.date) }}</time> · {{ readingMinutes(post) }} min read
    </p>
  </UiCard>
</template>
