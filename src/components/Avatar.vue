<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { initials } from '../utils/format'

const props = withDefaults(defineProps<{ src: string; name: string; size?: number }>(), { size: 48 })

// if the remote photo fails to load, fall back to a gradient with initials
const failed = ref(false)
watch(() => props.src, () => (failed.value = false))
const label = computed(() => initials(props.name))
const box = computed(() => ({ width: props.size + 'px', height: props.size + 'px' }))
</script>

<template>
  <span
    v-if="failed"
    role="img"
    :aria-label="name"
    class="grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 font-semibold text-white ring-2 ring-brand-500/40"
    :style="{ ...box, fontSize: size * 0.36 + 'px' }"
    data-test="avatar-fallback"
  >{{ label }}</span>
  <img
    v-else
    :src="src"
    :alt="name"
    :width="size"
    :height="size"
    loading="lazy"
    class="shrink-0 rounded-full bg-ink-600 object-cover ring-2 ring-brand-500/40"
    :style="box"
    @error="failed = true"
  />
</template>
