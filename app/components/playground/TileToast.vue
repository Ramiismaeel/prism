<script setup lang="ts">
import type { ToastType } from "~/composables/useToast";

const { toast } = useToast();

const samples: { type: ToastType; label: string; color: "mint" | "sky" | "sun" | "coral"; title: string; description: string }[] = [
  { type: "success", label: "Success", color: "mint", title: "Palette saved", description: "Your colors are safe with us." },
  { type: "info", label: "Info", color: "sky", title: "New gradient dropped", description: "Fresh from the Motion Lab." },
  { type: "warning", label: "Warning", color: "sun", title: "Low on glitter", description: "Order more before Friday." },
  { type: "error", label: "Error", color: "coral", title: "Prism misaligned", description: "Light went everywhere. Try again." },
];
</script>

<template>
  <PlaygroundTile title="Toasts" how="useToast() pushes into a global queue; the toast viewport animates each one in, stacks them with layout animations and pauses auto-dismiss on hover.">
    <div class="grid w-full grid-cols-2 gap-2">
      <UiBaseButton
        v-for="s in samples"
        :key="s.type"
        size="sm"
        variant="outline"
        :color="s.color"
        @click="toast({ type: s.type, title: s.title, description: s.description })"
      >
        {{ s.label }}
      </UiBaseButton>
    </div>
  </PlaygroundTile>
</template>
