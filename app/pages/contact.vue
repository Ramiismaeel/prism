<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";

useSeoMeta({
  title: "Contact",
  description: "Tell Prism about your idea in three tiny steps. We reply within a day.",
});

const sentTo = ref<string | null>(null);
const formKey = ref(0); // remounting the form resets it
const { toast } = useToast();

function onSent(name: string) {
  sentTo.value = name;
  toast({ type: "success", title: "Message sent", description: "We'll reply within a day." });
}
function reset() {
  sentTo.value = null;
  formKey.value++;
}

const details = [
  { icon: "lucide:mail", label: "Email", value: "hello@prism.studio" },
  { icon: "lucide:map-pin", label: "Studio", value: "Somewhere over the rainbow" },
  { icon: "lucide:clock", label: "Response time", value: "Within one working day" },
];

const reduceMotion = useReducedMotion();
</script>

<template>
  <div>
    <SectionsPageHeader
      eyebrow="Contact"
      title="Let's make it shine"
      lead="Tell us about your idea in three tiny steps. No forms longer than they need to be, we promise."
      color="sky"
    >
      <template #aside>
        <UiIllustration name="contact" alt="A person sending a message" :width="520" :height="360" eager class="mx-auto w-full max-w-lg" />
      </template>
    </SectionsPageHeader>

    <section class="mx-auto grid max-w-7xl gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_20rem] lg:px-8" aria-label="Contact form">
      <UiCard class="min-w-0" :padded="false">
        <div class="p-6 sm:p-10">
          <AnimatePresence mode="wait">
            <Motion
              :key="sentTo === null ? `form-${formKey}` : 'success'"
              :initial="{ opacity: 0, scale: 0.97 }"
              :animate="{ opacity: 1, scale: 1 }"
              :exit="{ opacity: 0, scale: 0.97 }"
              :transition="{ duration: reduceMotion ? 0 : 0.25 }"
            >
              <ContactForm v-if="sentTo === null" @sent="onSent" />
              <ContactSuccess v-else :name="sentTo" @reset="reset" />
            </Motion>
          </AnimatePresence>
        </div>
      </UiCard>

      <aside class="space-y-4" aria-label="Other ways to reach us">
        <UiCard v-for="d in details" :key="d.label" accent="sky">
          <div class="flex items-center gap-4">
            <span class="grid size-11 shrink-0 place-items-center rounded-2xl bg-sky/15 text-sky-ink dark:text-sky-glow">
              <Icon :name="d.icon" class="size-5" aria-hidden="true" />
            </span>
            <div>
              <p class="text-sm text-zinc-600 dark:text-zinc-400">{{ d.label }}</p>
              <p class="font-semibold">{{ d.value }}</p>
            </div>
          </div>
        </UiCard>
      </aside>
    </section>
  </div>
</template>
