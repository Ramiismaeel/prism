<script setup lang="ts">
import { formatDate, getPost, getRelated, readingMinutes, TAG_COLOR } from "~/data/posts";
import { picsum } from "~/utils/picsum";

// Unknown slug → 404. Route validation runs in the router before the page renders, so it works
// for SSR (real 404 status) *and* client navigation. Throwing from setup does not: on the client
// Vue keeps rendering the page with `post` undefined.
definePageMeta({
  validate: (route) =>
    !!getPost(String(route.params.slug)) || createError({ statusCode: 404, statusMessage: "Post not found" }),
});

const route = useRoute();
const post = getPost(String(route.params.slug))!;

const related = getRelated(post);
const cover = picsum(post.coverSeed, 1600, 800);

useSeoMeta({
  title: post.title,
  description: post.excerpt,
  ogTitle: post.title,
  ogDescription: post.excerpt,
  ogImage: picsum(post.coverSeed, 1200, 630),
  ogType: "article",
  articlePublishedTime: post.date,
  articleAuthor: [post.author],
  articleTag: post.tags,
});
</script>

<template>
  <div>
    <LayoutScrollProgress />

    <article aria-labelledby="post-title">
      <header class="mx-auto max-w-3xl px-4 pt-12 sm:px-6 lg:px-8">
        <MotionReveal :y="10">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-grape-ink transition-colors hover:text-grape dark:text-grape-glow"
          >
            <Icon name="lucide:arrow-left" class="size-4" aria-hidden="true" /> All posts
          </NuxtLink>
        </MotionReveal>
        <div class="mt-8 flex flex-wrap gap-2">
          <UiBadge v-for="tag in post.tags" :key="tag" :color="TAG_COLOR[tag] ?? 'grape'">{{ tag }}</UiBadge>
        </div>
        <MotionSplitText
          id="post-title"
          as="h1"
          :text="post.title"
          class="mt-4 block text-4xl leading-tight font-bold tracking-tight sm:text-5xl"
        />
        <MotionReveal :delay="0.3">
          <p class="mt-5 text-xl text-zinc-600 dark:text-zinc-400">{{ post.excerpt }}</p>
          <p class="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
            By <span class="font-semibold text-zinc-900 dark:text-white">{{ post.author }}</span> ·
            <time :datetime="post.date">{{ formatDate(post.date) }}</time> · {{ readingMinutes(post) }} min read
          </p>
        </MotionReveal>
      </header>

      <MotionReveal :y="40" :delay="0.2" class="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
        <NuxtImg
          format="webp"
          :src="cover"
          alt=""
          width="1600"
          height="800"
          sizes="100vw lg:1024px"
          loading="eager"
          fetchpriority="high"
          preload
          class="aspect-[2/1] w-full rounded-[2rem] object-cover shadow-2xl shadow-zinc-900/10"
        />
      </MotionReveal>

      <div class="mx-auto max-w-3xl space-y-6 px-4 py-14 text-lg leading-relaxed text-zinc-700 sm:px-6 lg:px-8 dark:text-zinc-300">
        <MotionReveal
          v-for="(paragraph, i) in post.body"
          :key="i"
          as="p"
          :y="24"
          :amount="0.4"
          :class="i === 0 && 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-none first-letter:font-bold first-letter:text-grape-ink dark:first-letter:text-grape-glow'"
        >
          {{ paragraph }}
        </MotionReveal>
      </div>
    </article>

    <aside class="border-t border-zinc-200 py-20 dark:border-zinc-800" aria-labelledby="related-title">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="related-title" class="mb-10 text-3xl font-bold tracking-tight">Keep reading</h2>
        <MotionStaggerList
          v-slot="{ item }"
          :items="related"
          :item-key="(p) => p.slug"
          class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          item-class="h-full"
        >
          <BlogPostCard :post="item" compact :heading-level="3" />
        </MotionStaggerList>
      </div>
    </aside>
  </div>
</template>
