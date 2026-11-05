<script setup lang="ts">
const clients = [
  { name: "Lumen", icon: "lucide:sun" },
  { name: "Spectra", icon: "lucide:rainbow" },
  { name: "Halo", icon: "lucide:circle-dot" },
  { name: "Prismatic", icon: "lucide:triangle" },
  { name: "Glowworm", icon: "lucide:sparkles" },
  { name: "Refract", icon: "lucide:aperture" },
  { name: "Beam", icon: "lucide:zap" },
];
const tags = ["Branding", "Motion", "Web", "Illustration", "Color systems", "3D", "Strategy"];
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <PlaygroundDemoBlock title="Card" description="Plain, accented, and interactive (hover lift)." class="lg:col-span-2">
      <div class="grid items-start gap-4 md:grid-cols-3">
        <UiCard>
          <h4 class="font-semibold">Plain card</h4>
          <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">A calm surface for any content.</p>
        </UiCard>
        <UiCard accent="coral">
          <h4 class="font-semibold">Accented card</h4>
          <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">A color strip along the top edge.</p>
        </UiCard>
        <UiCard interactive accent="sky">
          <template #media>
            <NuxtImg
              format="webp"
              src="https://picsum.photos/seed/card-demo/800/450"
              alt="Soft-focus landscape"
              width="800"
              height="450"
              loading="lazy"
              class="aspect-video w-full object-cover"
            />
          </template>
          <h4 class="font-semibold">Interactive card</h4>
          <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Hover me: I lift on a spring.</p>
        </UiCard>
      </div>
    </PlaygroundDemoBlock>

    <PlaygroundDemoBlock title="TiltCard" description="3D tilt and glare that follow the cursor.">
      <div class="grid gap-4 sm:grid-cols-2">
        <UiTiltCard>
          <div class="flex h-48 flex-col justify-end rounded-3xl bg-linear-135 from-grape via-coral to-sun p-5 text-white">
            <Icon name="lucide:gem" class="mb-auto size-7" aria-hidden="true" />
            <p class="font-display text-xl font-bold">Glow Branding</p>
            <p class="text-sm text-white/85">Tilt me around.</p>
          </div>
        </UiTiltCard>
        <UiTiltCard :max-tilt="18">
          <NuxtImg
            format="webp"
            src="https://picsum.photos/seed/tilt-demo/600/600"
            alt="Abstract colorful texture"
            width="600"
            height="600"
            loading="lazy"
            class="h-48 w-full rounded-3xl object-cover"
          />
        </UiTiltCard>
      </div>
    </PlaygroundDemoBlock>

    <PlaygroundDemoBlock title="Marquee" description="Infinite loop; eases to a stop on hover.">
      <div class="space-y-5">
        <UiMarquee :duration="25">
          <span
            v-for="c in clients"
            :key="c.name"
            class="inline-flex items-center gap-2 font-display text-xl font-bold text-zinc-400 dark:text-zinc-500"
          >
            <Icon :name="c.icon" class="size-6" aria-hidden="true" />{{ c.name }}
          </span>
        </UiMarquee>
        <UiMarquee :duration="35" :gap="12" reverse>
          <UiBadge
            v-for="(t, i) in tags"
            :key="t"
            :color="(['grape', 'coral', 'sun', 'mint', 'sky'] as const)[i % 5]"
            class="text-sm"
          >
            {{ t }}
          </UiBadge>
        </UiMarquee>
      </div>
    </PlaygroundDemoBlock>
  </div>
</template>
