<script setup lang="ts">
withDefaults(defineProps<{ size?: number; withName?: boolean }>(), { size: 32, withName: true })
</script>

<template>
  <div class="flex items-center gap-2.5">
    <svg :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#9576fb" />
          <stop offset="1" stop-color="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#lg)" />
      <path d="M18 24a6 6 0 0 1 6-6h16a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H31l-8 7v-7h-1a4 4 0 0 1-4-4z" fill="#fff" />
    </svg>
    <span v-if="withName" class="font-bold tracking-tight" :style="{ fontSize: size * 0.6 + 'px' }">Chatly</span>
  </div>
</template>
