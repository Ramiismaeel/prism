<script setup lang="ts">
import { AnimatePresence, motion, useReducedMotion } from "motion-v";
import { isNavActive, navLinks } from "~/data/navigation";

const route = useRoute();
const reduceMotion = useReducedMotion();
const menuOpen = ref(false);

const underlineTransition = computed(() =>
  reduceMotion.value
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 32 },
);

watch(
  () => route.path,
  () => {
    menuOpen.value = false;
  },
);
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/70 backdrop-blur-lg dark:border-zinc-800/70 dark:bg-zinc-950/70"
  >
    <div
      class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
    >
      <NuxtLink
        to="/"
        class="text-prism font-display text-2xl font-bold tracking-tight"
        aria-label="Prism home"
      >
        Prism
      </NuxtLink>

      <nav aria-label="Main" class="hidden md:block">
        <ul class="flex items-center gap-1">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="relative block px-3 py-2 text-sm font-medium transition-colors"
              :class="
                isNavActive(link.to, route.path)
                  ? 'text-zinc-900 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              "
            >
              {{ link.label }}
              <motion.span
                v-if="isNavActive(link.to, route.path)"
                layout-id="nav-underline"
                aria-hidden="true"
                class="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-linear-to-r from-grape via-coral to-sky"
                :transition="underlineTransition"
              />
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-1">
        <LayoutThemeToggle />
        <button
          type="button"
          class="grid size-10 place-items-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <AnimatePresence mode="wait" :initial="false">
            <motion.span
              :key="menuOpen ? 'close' : 'open'"
              class="grid place-items-center"
              :initial="{ opacity: 0, rotate: -90, scale: 0.6 }"
              :animate="{ opacity: 1, rotate: 0, scale: 1 }"
              :exit="{ opacity: 0, rotate: 90, scale: 0.6 }"
              :transition="{ duration: reduceMotion ? 0 : 0.15 }"
            >
              <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" class="size-5" />
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>

    <LayoutMobileMenu v-model:open="menuOpen" />
  </header>
</template>
