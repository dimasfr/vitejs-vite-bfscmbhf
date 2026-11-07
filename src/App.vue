<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="relative h-full overflow-hidden bg-ink-900">
    <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 animate-float rounded-full bg-brand-600/30 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 animate-float rounded-full bg-fuchsia-600/20 blur-3xl" style="animation-delay: -3s"></div>
    <div class="relative mx-auto h-full w-full max-w-md sm:border-x sm:border-white/5 sm:shadow-2xl sm:shadow-black/50">
      <RouterView />
    </div>
  </div>
</template>
