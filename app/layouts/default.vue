<template>
  <div class="flex min-h-dvh flex-col overflow-x-clip">
    <!-- overflow-x-clip: off-screen animation offsets (Reveal x, blobs) never cause sideways scroll.
         Unlike overflow-hidden it creates no scroll container, so the sticky header keeps working.
         It lives here, not on <body>, because body overflow propagates to the viewport as "hidden".
         (Keep comments inside the root: a comment before it counts as a second root node.) -->
    <a
      href="#main"
      class="sr-only z-50 rounded-full bg-grape px-4 py-2 font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
    <LayoutAppHeader />
    <main id="main" tabindex="-1" class="flex-1 focus:outline-none">
      <slot />
    </main>
    <LayoutAppFooter />
    <UiToast />
  </div>
</template>
