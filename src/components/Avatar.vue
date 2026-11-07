<script setup lang="ts">
withDefaults(defineProps<{ src: string; name: string; size?: number }>(), { size: 48 })
</script>

<template>
  <img
    :src="src"
    :alt="name"
    :width="size"
    :height="size"
    loading="lazy"
    class="shrink-0 rounded-full bg-ink-600 object-cover ring-2 ring-brand-500/40"
    :style="{ width: size + 'px', height: size + 'px' }"
  />
</template>
