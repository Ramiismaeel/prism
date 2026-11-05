<template>
  <section class="px-4 pb-24 sm:px-6 lg:px-8" aria-labelledby="cta-title">
    <MotionReveal
      :y="40"
      class="relative isolate mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-sun-glow/60 via-coral-glow/60 to-grape-glow/60 px-6 py-14 text-zinc-950 sm:px-12 lg:grid-cols-[1.2fr_1fr] dark:from-sun/25 dark:via-coral/25 dark:to-grape/35 dark:text-white"
    >
      <div>
        <h2 id="cta-title" class="text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to see your idea in full color?
        </h2>
        <p class="mt-4 max-w-lg text-lg text-zinc-800 dark:text-zinc-200">
          Tell us what you're dreaming up. We'll reply within a day with a plan, a palette and
          probably a few exclamation marks.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <UiMagneticButton>
            <UiBaseButton to="/contact" size="lg" icon="lucide:mouse-pointer-click">Let's talk</UiBaseButton>
          </UiMagneticButton>
          <UiBaseButton to="/services" size="lg" variant="ghost" color="grape" icon-right="lucide:arrow-right">
            Explore services
          </UiBaseButton>
        </div>
      </div>
      <UiIllustration
        name="cta"
        alt="A rocket launching from a laptop"
        :width="480"
        :height="360"
        class="mx-auto w-full max-w-md"
      />
    </MotionReveal>
  </section>
</template>
