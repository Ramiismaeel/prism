<script setup lang="ts">
import { team } from "~/data/team";
import { picsum } from "~/utils/picsum";
import type { ThemeColor } from "~/utils/themeColors";

// Back-of-card surfaces: deep shades so white text stays above 4.5:1.
const BACK: Record<ThemeColor, string> = {
  grape: "bg-linear-to-br from-grape-ink to-grape",
  coral: "bg-linear-to-br from-coral-ink to-grape-ink",
  sun: "bg-linear-to-br from-sun-ink to-coral-ink",
  mint: "bg-linear-to-br from-mint-ink to-sky-ink",
  sky: "bg-linear-to-br from-sky-ink to-grape-ink",
};
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="team-title">
    <div class="mb-14 text-center">
      <UiBadge color="coral" dot caps>The crew</UiBadge>
      <h2 id="team-title" class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Meet the light benders</h2>
      <p class="mt-4 text-zinc-600 dark:text-zinc-400">Hover (or tap) a card to flip it.</p>
    </div>

    <MotionStaggerList
      v-slot="{ item }"
      :items="team"
      :item-key="(m) => m.name"
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <UiFlipCard :flip-label="`Show ${item.name}'s bio`" class="h-[26rem]">
        <template #front>
          <!-- Picsum seeds are random scenes, not portraits: decorative (alt=""), the name is right below. -->
          <article class="relative h-full overflow-hidden rounded-3xl bg-zinc-200 dark:bg-zinc-800">
            <NuxtImg
              format="webp"
              :src="picsum(item.photoSeed, 600, 800)"
              alt=""
              width="600"
              height="800"
              sizes="100vw sm:50vw lg:400px"
              loading="lazy"
              class="h-full w-full object-cover"
            />
            <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-zinc-950/85 via-zinc-950/50 to-transparent p-5 pt-16 text-white">
              <h3 class="text-xl font-semibold">{{ item.name }}</h3>
              <p class="text-sm text-white/90">{{ item.role }}</p>
            </div>
          </article>
        </template>
        <template #back>
          <div class="flex h-full flex-col justify-between rounded-3xl p-6 text-white" :class="BACK[item.color]">
            <div>
              <p class="text-sm font-semibold tracking-widest uppercase">{{ item.role }}</p>
              <p class="mt-1 font-display text-2xl font-bold">{{ item.name }}</p>
              <p class="mt-4 leading-relaxed">{{ item.bio }}</p>
            </div>
            <ul class="flex gap-2" :aria-label="`${item.name} on social media`">
              <li v-for="s in item.socials" :key="s.label">
                <a
                  :href="s.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="`${item.name} on ${s.label}`"
                  class="grid size-10 place-items-center rounded-full bg-white/15 transition-colors hover:bg-white/30"
                >
                  <Icon :name="s.icon" class="size-4" />
                </a>
              </li>
            </ul>
          </div>
        </template>
      </UiFlipCard>
    </MotionStaggerList>
  </section>
</template>
