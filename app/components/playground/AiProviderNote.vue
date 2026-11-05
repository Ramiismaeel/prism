<script setup lang="ts">
type Provider = "claude" | "gemini";

defineProps<{
  provider: Provider | "demo";
  demo: boolean;
  /** Set when a configured provider failed and the server served samples instead. */
  fallbackFrom?: Provider;
  /** What the samples are, e.g. "taglines" or "a component". */
  what: string;
}>();

const NAME: Record<Provider, string> = { claude: "Claude (Haiku)", gemini: "Gemini (Flash-Lite)" };
</script>

<template>
  <!-- Samples: either no key is configured, or the provider was busy and the server fell back. -->
  <p
    v-if="demo"
    class="flex items-start gap-2 rounded-2xl bg-sun/15 px-4 py-3 text-sm text-sun-ink dark:bg-sun/10 dark:text-sun-glow"
  >
    <Icon name="lucide:flask-conical" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
    <span v-if="fallbackFrom">
      <strong>{{ NAME[fallbackFrom] }} is busy right now,</strong> so this is a sample ({{ what }}). Try again in a moment.
    </span>
    <span v-else>
      <strong>Demo mode:</strong> this is a sample ({{ what }}). Add <code class="font-mono text-xs">NUXT_GEMINI_API_KEY</code> or
      <code class="font-mono text-xs">NUXT_ANTHROPIC_API_KEY</code> on the server for real AI results.
    </span>
  </p>
  <p v-else class="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
    <Icon name="lucide:sparkles" class="size-4 text-grape-ink dark:text-grape-glow" aria-hidden="true" />
    Made by {{ NAME[provider as Provider] }}
  </p>
</template>
