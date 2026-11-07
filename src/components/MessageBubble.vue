<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '../stores/types'
import { formatClock } from '../utils/format'

const props = defineProps<{ message: Message; senderName: string }>()
const mine = computed(() => props.message.from === 'me')
</script>

<template>
  <div class="flex animate-pop" :class="mine ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[80%] rounded-2xl px-3.5 py-2 shadow"
      :class="mine ? 'rounded-br-md bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white' : 'rounded-bl-md bg-ink-700 text-slate-100'"
    >
      <div class="mb-0.5 flex items-baseline justify-between gap-4 text-[11px]">
        <span class="font-semibold" :class="mine ? 'text-white/80' : 'text-brand-300'" data-test="sender">{{ senderName }}</span>
        <span class="opacity-60" data-test="clock">{{ formatClock(message.at) }}</span>
      </div>
      <p class="whitespace-pre-wrap break-words text-sm" data-test="text">{{ message.text }}</p>
    </div>
  </div>
</template>
