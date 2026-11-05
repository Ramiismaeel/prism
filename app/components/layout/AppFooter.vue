<script setup lang="ts">
import { navLinks, socialLinks } from "~/data/navigation";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="relative border-t border-zinc-200 dark:border-zinc-800">
    <div
      aria-hidden="true"
      class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-grape via-coral via-50% to-sky"
    />
    <div
      class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8"
    >
      <div class="space-y-3">
        <NuxtLink to="/" class="text-prism font-display text-2xl font-bold">Prism</NuxtLink>
        <p class="max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
          We bend light into ideas. A tiny creative studio with a big box of crayons.
        </p>
      </div>

      <nav aria-label="Footer">
        <h2 class="mb-3 text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-100">
          Explore
        </h2>
        <ul class="grid grid-cols-2 gap-2 text-sm">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="text-zinc-600 transition-colors hover:text-grape dark:text-zinc-400 dark:hover:text-grape-glow"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="mb-3 text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-100">
          Say hi
        </h2>
        <ul class="flex gap-2" aria-label="Social links">
          <li v-for="s in socialLinks" :key="s.label">
            <a
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="s.label"
              class="grid size-10 place-items-center rounded-full bg-zinc-100 text-zinc-600 transition hover:-translate-y-0.5 hover:bg-grape hover:text-white dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-grape dark:hover:text-white"
            >
              <Icon :name="s.icon" class="size-4" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-zinc-200 dark:border-zinc-800">
      <p
        class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-zinc-500 sm:px-6 lg:px-8 dark:text-zinc-500"
      >
        <span>© {{ year }} Prism Studio. All colors reserved.</span>
        <span class="inline-flex items-center gap-1">
          Made with <Icon name="lucide:heart" class="size-3.5 text-coral" aria-label="love" /> and
          too many gradients
        </span>
      </p>
    </div>
  </footer>
</template>
