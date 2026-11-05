<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";
import { IDEA_MAX, IDEA_MIN } from "#shared/utils/tagline";

const idea = ref("");
const loading = ref(false);
const taglines = ref<string[]>([]);
const demo = ref(false); // true when the server has no API key and returned sample taglines
const runId = ref(0); // re-keys the results so each run animates fresh
const { toast } = useToast();

const canSubmit = computed(() => !loading.value && idea.value.trim().length >= IDEA_MIN);

async function generate() {
  if (!canSubmit.value) return;
  loading.value = true;
  taglines.value = [];
  try {
    const res = await $fetch<{ taglines: string[]; demo: boolean }>("/api/tagline", { method: "POST", body: { idea: idea.value } });
    taglines.value = res.taglines;
    demo.value = res.demo;
    runId.value++;
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } }).data?.statusMessage;
    toast({ type: "error", title: "No taglines this time", description: message ?? "Something went wrong. Please try again." });
  } finally {
    loading.value = false;
  }
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast({ type: "success", title: "Copied!", description: text, duration: 2500 });
  } catch {
    toast({ type: "error", title: "Couldn't copy", description: "Your browser blocked clipboard access." });
  }
}

const COLORS = ["border-l-grape", "border-l-coral", "border-l-mint"];
const reduceMotion = useReducedMotion();
const pulse = computed(() => (reduceMotion.value ? { duration: 0 } : { duration: 1.2, repeat: Infinity }));
</script>

<template>
  <PlaygroundDemoBlock
    title="AI tagline machine"
    description="Describe a startup idea and Claude (Haiku) writes three playful taglines. With an API key set, your idea is sent to Anthropic's API; without one, the widget runs in demo mode."
  >
    <form class="space-y-4" @submit.prevent="generate">
      <FormTextarea v-model="idea" label="Your startup idea" name="idea" :rows="2" :maxlength="IDEA_MAX" />
      <UiBaseButton type="submit" icon="lucide:sparkles" :loading="loading" :disabled="!canSubmit && !loading">
        {{ loading ? "Thinking up taglines…" : "Generate taglines" }}
      </UiBaseButton>
    </form>

    <!-- Announce results once they arrive. -->
    <p class="sr-only" aria-live="polite">
      {{ loading ? "Generating taglines" : taglines.length ? `${taglines.length} ${demo ? "sample " : ""}taglines ready` : "" }}
    </p>

    <p
      v-if="demo && taglines.length && !loading"
      class="mt-6 flex items-start gap-2 rounded-2xl bg-sun/15 px-4 py-3 text-sm text-sun-ink dark:bg-sun/10 dark:text-sun-glow"
    >
      <Icon name="lucide:flask-conical" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span><strong>Demo mode:</strong> these are sample taglines. Add an Anthropic API key (<code class="font-mono text-xs">NUXT_ANTHROPIC_API_KEY</code>) to get real ones from Claude.</span>
    </p>

    <div class="mt-6 min-h-[13rem]">
      <AnimatePresence mode="wait">
        <!-- Loading shimmer -->
        <div v-if="loading" key="loading" class="space-y-3" aria-hidden="true">
          <Motion
            v-for="i in 3"
            :key="i"
            class="h-16 rounded-2xl bg-linear-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800"
            :animate="{ opacity: [0.5, 1, 0.5] }"
            :transition="{ ...pulse, delay: i * 0.15 }"
          />
        </div>
        <!-- Results: staggered cards that type themselves -->
        <MotionStaggerList
          v-else-if="taglines.length"
          :key="runId"
          v-slot="{ item, index }"
          :items="taglines"
          :stagger="0.15"
          class="space-y-3"
        >
          <div
            class="flex items-center justify-between gap-3 rounded-2xl border border-l-4 border-y-zinc-200 border-r-zinc-200 bg-white p-4 shadow-sm dark:border-y-zinc-700 dark:border-r-zinc-700 dark:bg-zinc-800"
            :class="COLORS[index % 3]"
          >
            <p class="font-display text-lg font-semibold">
              <MotionTypewriter :text="item" :delay="0.25 + index * 0.35" />
            </p>
            <button
              type="button"
              class="grid size-9 shrink-0 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-white"
              :aria-label="`Copy tagline: ${item}`"
              @click="copy(item)"
            >
              <Icon name="lucide:copy" class="size-4" />
            </button>
          </div>
        </MotionStaggerList>
        <p v-else key="empty" class="grid h-52 place-items-center rounded-2xl border-2 border-dashed border-zinc-200 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          Your taglines will appear here.
        </p>
      </AnimatePresence>
    </div>
  </PlaygroundDemoBlock>
</template>
