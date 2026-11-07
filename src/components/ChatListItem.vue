<script setup lang="ts">
import { computed } from 'vue'
import Avatar from './Avatar.vue'
import type { Chat } from '../stores/types'
import { formatChatTime } from '../utils/format'

const props = defineProps<{ chat: Chat; now: number; keyword?: string }>()
const emit = defineEmits<{ (e: 'select', id: number): void }>()

const last = computed(() => props.chat.messages[props.chat.messages.length - 1])
const time = computed(() => formatChatTime(last.value.at, props.now))
const preview = computed(() => (last.value.from === 'me' ? '✓ ' : '') + last.value.text)

// split the name so the matched keyword can be highlighted
const parts = computed(() => {
  const name = props.chat.contact.name
  const k = (props.keyword ?? '').trim()
  const i = k ? name.toLowerCase().indexOf(k.toLowerCase()) : -1
  if (i < 0) return { before: name, match: '', after: '' }
  return { before: name.slice(0, i), match: name.slice(i, i + k.length), after: name.slice(i + k.length) }
})
</script>

<template>
  <li>
    <button
      type="button"
      class="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5 active:bg-white/10"
      @click="emit('select', chat.id)"
    >
      <Avatar :src="chat.contact.avatar" :name="chat.contact.name" />
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between gap-2">
          <p class="truncate font-semibold" data-test="name">
            {{ parts.before }}<mark v-if="parts.match" class="rounded bg-brand-500/40 px-0.5 text-white">{{ parts.match }}</mark>{{ parts.after }}
          </p>
          <span class="shrink-0 text-xs" :class="chat.unread ? 'text-brand-300' : 'text-slate-500'" data-test="time">{{ time }}</span>
        </div>
        <div class="mt-0.5 flex items-center justify-between gap-2">
          <p class="truncate text-sm text-slate-400" data-test="preview">{{ preview }}</p>
          <span
            v-if="chat.unread"
            class="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 px-1.5 text-[11px] font-bold text-white"
            data-test="unread"
          >{{ chat.unread }}</span>
        </div>
      </div>
    </button>
  </li>
</template>
