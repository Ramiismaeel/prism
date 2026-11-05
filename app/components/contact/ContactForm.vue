<script setup lang="ts">
import { AnimatePresence, Motion, animate, useReducedMotion } from "motion-v";
import { BUDGETS, CONTACT_STEPS, TOPICS, contactSchema, fieldErrors, type ContactField } from "#shared/utils/contactSchema";

const emit = defineEmits<{ sent: [name: string] }>();

const form = reactive({ name: "", email: "", topic: "", budget: "", message: "", consent: false });
const errors = ref<Partial<Record<ContactField, string>>>({});
const step = ref(0);
const direction = ref(1);
const sending = ref(false);
const isLast = computed(() => step.value === CONTACT_STEPS.length - 1);

// Editing a field clears its error as soon as the new value is valid.
watch(
  form,
  () => {
    errors.value = Object.fromEntries(
      Object.entries(errors.value).filter(([key]) => !contactSchema.shape[key as ContactField].safeParse(form[key as ContactField]).success),
    );
  },
  { deep: true },
);

const panel = ref<HTMLElement | null>(null);
const heading = ref<HTMLElement | null>(null);
const reduceMotion = useReducedMotion();

/** Shake the step and move focus to the first invalid field (which announces its error). */
async function reject(next: Partial<Record<ContactField, string>>) {
  errors.value = next;
  await nextTick();
  panel.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  if (panel.value && !reduceMotion.value) animate(panel.value, { x: [0, -12, 12, -8, 8, -4, 4, 0] }, { duration: 0.45 });
}

// AnimatePresence (mode "wait") mounts the next step only after the old one has animated out,
// so focus its heading when it actually appears. That announces "Step 2 of 3: Your project".
let onStepMounted: (() => void) | undefined;
watch(heading, (el) => {
  if (!el || !onStepMounted) return;
  const run = onStepMounted;
  onStepMounted = undefined;
  run();
});

function goTo(index: number, afterMount: () => void = () => heading.value?.focus()) {
  direction.value = index > step.value ? 1 : -1;
  onStepMounted = afterMount;
  step.value = index;
}

async function onSubmit() {
  const fields = Object.fromEntries(CONTACT_STEPS[step.value]!.fields.map((f) => [f, true])) as Partial<Record<ContactField, true>>;
  const result = contactSchema.pick(fields).safeParse(form);
  if (!result.success) return reject(fieldErrors(result.error));
  if (!isLast.value) return goTo(step.value + 1);

  sending.value = true;
  try {
    await $fetch("/api/contact", { method: "POST", body: form });
    emit("sent", form.name.trim());
  } catch (err) {
    const server = (err as { data?: { data?: { fieldErrors?: Partial<Record<ContactField, string>> } } }).data?.data?.fieldErrors;
    useToast().toast({ type: "error", title: "Message not sent", description: server ? "Please check the highlighted fields." : "Something went wrong. Please try again." });
    if (server) {
      const first = CONTACT_STEPS.findIndex((s) => s.fields.some((f) => server[f]));
      if (first >= 0 && first !== step.value) goTo(first, () => reject(server));
      else await reject(server);
    }
  } finally {
    sending.value = false;
  }
}

const slide = computed(() => ({ duration: reduceMotion.value ? 0 : 0.3 }));
</script>

<template>
  <form novalidate class="space-y-8" @submit.prevent="onSubmit">
    <FormStepIndicator :steps="CONTACT_STEPS.map((s) => s.title)" :current="step" />

    <div ref="panel" class="overflow-x-clip">
      <AnimatePresence mode="wait" :initial="false">
        <Motion
          :key="step"
          as="fieldset"
          class="space-y-5"
          :initial="{ opacity: 0, x: 40 * direction }"
          :animate="{ opacity: 1, x: 0 }"
          :exit="{ opacity: 0, x: -40 * direction }"
          :transition="slide"
        >
          <legend ref="heading" tabindex="-1" class="mb-5 font-display text-2xl font-bold outline-none">
            <span class="sr-only">Step {{ step + 1 }} of {{ CONTACT_STEPS.length }}: </span>{{ CONTACT_STEPS[step]!.title }}
          </legend>
          <template v-if="step === 0">
            <FormInput v-model="form.name" label="Your name" name="name" autocomplete="name" :error="errors.name" />
            <FormInput v-model="form.email" label="Email" name="email" type="email" autocomplete="email" :error="errors.email" />
          </template>
          <template v-else-if="step === 1">
            <FormSelect v-model="form.topic" label="What can we help with?" name="topic" :options="TOPICS" placeholder="Choose a topic…" :error="errors.topic" />
            <FormRadioGroup v-model="form.budget" legend="Budget" name="budget" :options="BUDGETS" :error="errors.budget" />
          </template>
          <template v-else>
            <FormTextarea v-model="form.message" label="Tell us about your idea" name="message" :maxlength="2000" :error="errors.message" />
            <FormCheckbox v-model="form.consent" name="consent" :error="errors.consent">
              I agree that Prism may store my details to reply to this message.
            </FormCheckbox>
          </template>
        </Motion>
      </AnimatePresence>
    </div>

    <div class="flex items-center justify-between gap-4">
      <UiBaseButton v-if="step > 0" variant="ghost" icon="lucide:arrow-left" @click="goTo(step - 1)">Back</UiBaseButton>
      <span v-else />
      <UiBaseButton type="submit" :loading="sending" :icon-right="isLast ? 'lucide:send' : 'lucide:arrow-right'">
        {{ isLast ? (sending ? "Sending…" : "Send message") : "Next" }}
      </UiBaseButton>
    </div>
  </form>
</template>
