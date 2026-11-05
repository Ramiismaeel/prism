<script setup lang="ts">
import { Motion, MotionConfig, useReducedMotion } from "motion-v";
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

const status = computed(() => props.error.statusCode ?? 500);
const isNotFound = computed(() => status.value === 404);
// Client errors can show their message ("Post not found"); server errors stay generic.
const detail = computed(() =>
  status.value < 500 && props.error.statusMessage && props.error.statusMessage !== "Page Not Found"
    ? props.error.statusMessage
    : undefined,
);

useSeoMeta({
  title: () => (isNotFound.value ? "Page not found · Prism" : "Something went wrong · Prism"),
  robots: "noindex",
});

const dragArea = ref<HTMLElement | null>(null);
const reduceMotion = useReducedMotion();
const pop = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 14 },
);

const goHome = () => clearError({ redirect: "/" });
</script>

<template>
  <!-- error.vue replaces app.vue, so it brings its own MotionConfig and wraps itself in the layout. -->
  <MotionConfig reduced-motion="user">
    <NuxtLayout>
      <section class="relative isolate overflow-hidden" aria-labelledby="error-title">
        <MotionGradientBlob color="grape" class="-top-24 -left-24 -z-10 size-96" />
        <MotionGradientBlob color="coral" class="top-1/3 -right-24 -z-10 size-80" :delay="2" />
        <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div class="text-center lg:text-left">
            <Motion
              as="p"
              class="text-prism font-display text-[7rem] leading-none font-bold tracking-tighter sm:text-[10rem]"
              :initial="{ opacity: 0, scale: 0.5, rotate: -8 }"
              :animate="{ opacity: 1, scale: 1, rotate: 0 }"
              :transition="pop"
              aria-hidden="true"
            >
              {{ status }}
            </Motion>
            <h1 id="error-title" class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              <span class="sr-only">Error {{ status }}: </span>
              {{ isNotFound ? "This page bent out of the spectrum" : "Something went a little wonky" }}
            </h1>
            <p class="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {{
                isNotFound
                  ? "The light you're looking for isn't here. It may have moved, or it never existed."
                  : "We hit an unexpected snag. Try again in a moment, or head back home."
              }}
            </p>
            <p v-if="detail" class="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ detail }}</p>
            <div class="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <UiBaseButton size="lg" icon="lucide:house" @click="goHome">Back home</UiBaseButton>
              <UiBaseButton size="lg" variant="outline" to="/contact">Report a broken link</UiBaseButton>
            </div>
          </div>

          <!-- Draggable illustration, kept inside its area by dragConstraints. -->
          <div ref="dragArea" class="relative grid h-80 place-items-center rounded-[2.5rem] border-2 border-dashed border-zinc-200 sm:h-96 dark:border-zinc-800">
            <Motion
              drag
              :drag-constraints="dragArea ?? undefined"
              :drag-elastic="0.2"
              :while-drag="{ scale: 1.05, rotate: 4 }"
              :while-hover="{ scale: 1.02 }"
              class="w-64 cursor-grab touch-none active:cursor-grabbing sm:w-80"
            >
              <UiIllustration name="not-found" alt="A person looking puzzled at a broken page" :width="400" :height="280" eager class="pointer-events-none select-none" />
            </Motion>
            <p class="absolute bottom-4 text-xs font-medium text-zinc-500 dark:text-zinc-400" aria-hidden="true">
              psst… you can drag me around
            </p>
          </div>
        </div>
      </section>
    </NuxtLayout>
  </MotionConfig>
</template>
