<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";
import { PROMPT_MAX, PROMPT_MIN, type ComponentRecipe } from "#shared/utils/componentSpec";

type Provider = "claude" | "gemini";
interface Response { recipe: ComponentRecipe; provider: Provider | "demo"; demo: boolean; fallbackFrom?: Provider }

const EXAMPLES = [
  "A toggle with smooth animation for dark mode",
  "A big coral 'Buy now' button that follows the cursor",
  "An FAQ about pizza delivery",
  "A purple headline saying 'Hello, light'",
  "A counter for 1,500 happy users",
  "A blue modal welcoming new members",
];

const prompt = ref("");
const loading = ref(false);
const result = ref<Response | null>(null);
const runId = ref(0); // remounts the preview so each result animates in fresh
const { toast } = useToast();
const canSubmit = computed(() => !loading.value && prompt.value.trim().length >= PROMPT_MIN);

async function generate() {
  if (!canSubmit.value) return;
  loading.value = true;
  try {
    result.value = await $fetch<Response>("/api/component", { method: "POST", body: { prompt: prompt.value } });
    runId.value++;
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } }).data?.statusMessage;
    toast({ type: "error", title: "No component this time", description: message ?? "Something went wrong. Please try again." });
  } finally {
    loading.value = false;
  }
}

function useExample(text: string) {
  prompt.value = text;
  void generate();
}

const reduceMotion = useReducedMotion();
const pop = computed(() => (reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 24 }));
</script>

<template>
  <PlaygroundDemoBlock
    title="AI component generator"
    description="Describe a component and the AI picks one from Prism's kit and fills in its settings. It never writes code: the recipe is validated on the server and rendered with Prism's real components."
  >
    <form class="space-y-4" @submit.prevent="generate">
      <FormTextarea v-model="prompt" label="Describe a component" name="component-prompt" :rows="2" :maxlength="PROMPT_MAX" />
      <div class="flex flex-wrap items-center gap-2">
        <UiBaseButton type="submit" icon="lucide:wand-sparkles" :loading="loading" :disabled="!canSubmit && !loading">
          {{ loading ? "Building…" : "Generate component" }}
        </UiBaseButton>
        <span class="text-xs text-zinc-600 dark:text-zinc-400">or try:</span>
        <button
          v-for="ex in EXAMPLES"
          :key="ex"
          type="button"
          class="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-grape/10 hover:text-grape-ink disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-grape/20 dark:hover:text-grape-glow"
          :disabled="loading"
          @click="useExample(ex)"
        >
          {{ ex }}
        </button>
      </div>
    </form>

    <p class="sr-only" aria-live="polite">
      {{ loading ? "Building component" : result ? `${result.demo ? "Sample " : ""}${result.recipe.component.type} ready: ${result.recipe.summary}` : "" }}
    </p>

    <div v-if="result && !loading" class="mt-6 space-y-3">
      <PlaygroundAiProviderNote :provider="result.provider" :demo="result.demo" :fallback-from="result.fallbackFrom" what="a component" />
      <p class="text-sm font-medium">{{ result.recipe.summary }}</p>
    </div>

    <!-- Preview stage -->
    <div
      class="mt-4 grid min-h-56 place-items-center rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
      :aria-busy="loading"
    >
      <AnimatePresence mode="wait">
        <Motion
          v-if="loading"
          key="loading"
          class="size-14 rounded-2xl bg-linear-135 from-grape via-coral to-sun"
          :animate="reduceMotion ? {} : { rotate: [0, 90, 180, 270, 360], borderRadius: ['30%', '50%', '30%', '50%', '30%'] }"
          :transition="{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }"
          aria-hidden="true"
        />
        <Motion
          v-else-if="result"
          :key="runId"
          class="w-full"
          :initial="{ opacity: 0, scale: 0.9, y: 12 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="pop"
        >
          <PlaygroundSpecRenderer :spec="result.recipe.component" />
        </Motion>
        <p v-else key="empty" class="text-sm text-zinc-500 dark:text-zinc-400">Your component will appear here.</p>
      </AnimatePresence>
    </div>

    <details v-if="result && !loading" class="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <summary class="cursor-pointer px-4 py-3 text-sm font-medium">View recipe (what the AI returned)</summary>
      <pre class="overflow-x-auto px-4 pb-4 font-mono text-xs text-zinc-700 dark:text-zinc-300">{{ JSON.stringify(result.recipe.component, null, 2) }}</pre>
    </details>
  </PlaygroundDemoBlock>
</template>
