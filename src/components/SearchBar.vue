<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps<{ modelValue: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'close'): void
}>()

const input = ref<HTMLInputElement>()
onMounted(() => input.value?.focus())
</script>

<template>
  <div class="flex items-center gap-2">
    <button type="button" aria-label="Close search" class="rounded-full p-2 text-slate-300 hover:bg-white/10" @click="emit('close')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
    </button>
    <div class="flex flex-1 items-center gap-2 rounded-full bg-ink-700 px-3 ring-1 ring-white/10 focus-within:ring-brand-500">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-slate-400"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <input
        ref="input"
        :value="modelValue"
        type="text"
        placeholder="Search by contact name..."
        class="w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-500"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button v-if="modelValue" type="button" aria-label="Clear search" class="text-slate-400 hover:text-white" @click="emit('update:modelValue', '')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </div>
  </div>
</template>
