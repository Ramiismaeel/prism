<script setup lang="ts">
import type { ToastType } from "~/composables/useToast";

const modalOpen = ref(false);
const { toast } = useToast();

const samples: { type: ToastType; title: string; description: string; icon: string }[] = [
  { type: "success", title: "Palette saved", description: "Your colors are safe with us.", icon: "lucide:circle-check" },
  { type: "info", title: "New gradient dropped", description: "Fresh from the Motion Lab.", icon: "lucide:info" },
  { type: "warning", title: "Running low on glitter", description: "Order more before Friday.", icon: "lucide:triangle-alert" },
  { type: "error", title: "Prism misaligned", description: "Light went everywhere. Try again.", icon: "lucide:circle-x" },
];
const BUTTON_COLOR = { success: "mint", info: "sky", warning: "sun", error: "coral" } as const;

function confirm(close: () => void) {
  close();
  toast({ type: "success", title: "Refraction scheduled", description: "We'll bend the light at noon." });
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <PlaygroundDemoBlock title="Modal" description="Focus is trapped; ESC, the close button or the backdrop close it.">
      <UiBaseButton icon="lucide:panel-top-open" @click="modalOpen = true">Open modal</UiBaseButton>
      <UiModal
        v-model:open="modalOpen"
        title="Schedule a refraction"
        description="Pick when we should bend the light for your project."
      >
        <p class="text-zinc-600 dark:text-zinc-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Our prisms are calibrated daily
          and work best with natural sunlight.
        </p>
        <template #footer="{ close }">
          <UiBaseButton variant="ghost" color="grape" @click="close">Cancel</UiBaseButton>
          <UiBaseButton icon="lucide:calendar-check" @click="confirm(close)">Confirm</UiBaseButton>
        </template>
      </UiModal>
    </PlaygroundDemoBlock>

    <PlaygroundDemoBlock title="Toast" description="useToast(): stacks, auto-dismisses, pauses on hover.">
      <div class="flex flex-wrap gap-3">
        <UiBaseButton
          v-for="s in samples"
          :key="s.type"
          variant="outline"
          :color="BUTTON_COLOR[s.type]"
          :icon="s.icon"
          @click="toast({ type: s.type, title: s.title, description: s.description })"
        >
          {{ s.type }}
        </UiBaseButton>
      </div>
    </PlaygroundDemoBlock>
  </div>
</template>
