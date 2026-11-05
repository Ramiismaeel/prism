<script setup lang="ts">
import { AnimatePresence, motion, useReducedMotion } from "motion-v";
import { isNavActive, navLinks, socialLinks } from "~/data/navigation";

const open = defineModel<boolean>("open", { required: true });

const route = useRoute();
const reduceMotion = useReducedMotion();
const panel = ref<HTMLElement | null>(null);

const close = () => {
  open.value = false;
};

useFocusTrap(panel, open, close);
useScrollLock(open);

const panelTransition = computed(() =>
  reduceMotion.value
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 34 },
);

const linkVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: reduceMotion.value ? 0 : 0.08 + i * 0.05 },
  }),
};
</script>

<template>
  <!-- Teleported out of the header: its backdrop-filter would otherwise trap position:fixed. -->
  <Teleport to="#teleports">
    <AnimatePresence>
      <motion.div
        v-if="open"
        key="backdrop"
        class="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-sm md:hidden"
        aria-hidden="true"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: reduceMotion ? 0 : 0.2 }"
        @click="close"
      />
      <motion.div
        v-if="open"
        id="mobile-menu"
        key="panel"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        class="fixed inset-y-0 right-0 z-50 w-[min(20rem,85vw)] bg-white shadow-2xl md:hidden dark:bg-zinc-900"
        :initial="{ x: '100%' }"
        :animate="{ x: 0 }"
        :exit="{ x: '100%' }"
        :transition="panelTransition"
      >
        <div ref="panel" class="flex h-full flex-col gap-8 overflow-y-auto p-6">
          <div class="flex items-center justify-between">
            <span class="text-prism font-display text-2xl font-bold">Prism</span>
            <button
              type="button"
              class="grid size-10 place-items-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="Close menu"
              @click="close"
            >
              <Icon name="lucide:x" class="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile">
            <ul class="flex flex-col gap-1">
              <motion.li
                v-for="(link, i) in navLinks"
                :key="link.to"
                :custom="i"
                :variants="linkVariants"
                initial="hidden"
                animate="visible"
              >
                <NuxtLink
                  :to="link.to"
                  class="flex items-center justify-between rounded-xl px-4 py-3 font-display text-lg font-medium transition-colors"
                  :class="
                    isNavActive(link.to, route.path)
                      ? 'bg-grape/10 text-grape dark:bg-grape/20 dark:text-grape-glow'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  "
                  @click="close"
                >
                  {{ link.label }}
                  <Icon name="lucide:arrow-up-right" class="size-4 opacity-60" />
                </NuxtLink>
              </motion.li>
            </ul>
          </nav>

          <ul class="mt-auto flex gap-2" aria-label="Social links">
            <li v-for="s in socialLinks" :key="s.label">
              <a
                :href="s.href"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="s.label"
                class="grid size-10 place-items-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-grape dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-grape-glow"
              >
                <Icon :name="s.icon" class="size-4" />
              </a>
            </li>
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>
