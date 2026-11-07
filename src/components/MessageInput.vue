<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'send', text: string): void }>()
const text = ref('')

function submit() {
  const t = text.value.trim()
  if (!t) return
  emit('send', t)
  text.value = ''
}
</script>

<template>
  <form class="flex items-center gap-2 border-t border-white/5 bg-ink-800/80 p-3 backdrop-blur" @submit.prevent="submit">
    <input
      v-model="text"
      type="text"
      placeholder="Type your message here"
      class="flex-1 rounded-full bg-ink-700 px-4 py-2.5 text-sm outline-none ring-1 ring-white/10 placeholder:text-slate-500 focus:ring-brand-500"
      @keydown.enter.prevent="submit"
    />
    <button
      type="submit"
      aria-label="Send"
      :disabled="!text.trim()"
      class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white transition enabled:hover:scale-105 disabled:opacity-40"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12 2-12 2z" /></svg>
    </button>
  </form>
</template>
