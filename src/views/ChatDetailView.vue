<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from '../components/Avatar.vue'
import MessageBubble from '../components/MessageBubble.vue'
import MessageInput from '../components/MessageInput.vue'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'
import { formatDayLabel, isSameDay } from '../utils/format'

const props = defineProps<{ id: string }>()
const router = useRouter()
const auth = useAuthStore()
const chatStore = useChatStore()

const chat = computed(() => chatStore.getChat(Number(props.id)))
const isTyping = computed(() => !!chat.value && !!chatStore.typing[chat.value.id])
const list = ref<HTMLElement>()

// messages interleaved with day separators
const items = computed(() => {
  const out: ({ kind: 'day'; key: string; label: string } | { kind: 'msg'; key: string; msg: NonNullable<typeof chat.value>['messages'][number] })[] = []
  let prev = 0
  for (const m of chat.value?.messages ?? []) {
    if (!prev || !isSameDay(prev, m.at)) out.push({ kind: 'day', key: `d${m.id}`, label: formatDayLabel(m.at) })
    out.push({ kind: 'msg', key: m.id, msg: m })
    prev = m.at
  }
  return out
})

function scrollBottom() {
  nextTick(() => list.value && (list.value.scrollTop = list.value.scrollHeight))
}

// guard unknown ids; mark this chat active + read whenever it is open
watch(
  () => props.id,
  () => {
    if (!chat.value) return router.replace({ name: 'chats' })
    chatStore.setActive(chat.value.id)
    chatStore.markRead(chat.value.id)
  },
  { immediate: true },
)
// auto scroll on new messages / typing indicator
watch(() => [chat.value?.messages.length, isTyping.value], scrollBottom)
onMounted(scrollBottom)
onBeforeUnmount(() => chatStore.setActive(null))

function send(text: string) {
  if (!chat.value) return
  if (chatStore.send(chat.value.id, text)) chatStore.scheduleReply(chat.value.id)
}
</script>

<template>
  <div v-if="chat" class="flex h-full flex-col">
    <header class="flex h-16 shrink-0 items-center gap-3 border-b border-white/5 bg-ink-800/80 px-3 backdrop-blur">
      <button type="button" aria-label="Back" class="rounded-full p-2 text-slate-300 hover:bg-white/10" @click="router.push({ name: 'chats' })">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
      </button>
      <Avatar :src="chat.contact.avatar" :name="chat.contact.name" :size="38" />
      <div class="min-w-0">
        <h1 class="truncate font-semibold leading-tight">{{ chat.contact.name }}</h1>
        <p v-if="isTyping" class="text-xs text-brand-300" data-test="typing">typing…</p>
        <p v-else class="flex items-center gap-1 text-xs text-emerald-400"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>Online</p>
      </div>
    </header>

    <div ref="list" class="scroll-thin flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
      <template v-for="it in items" :key="it.key">
        <div v-if="it.kind === 'day'" class="flex justify-center py-1" data-test="day">
          <span class="rounded-full bg-ink-700 px-3 py-0.5 text-[11px] text-slate-400">{{ it.label }}</span>
        </div>
        <MessageBubble v-else :message="it.msg" :sender-name="it.msg.from === 'me' ? auth.name : chat.contact.name" />
      </template>
      <div v-if="isTyping" class="flex animate-pop justify-start">
        <div class="flex gap-1 rounded-2xl rounded-bl-md bg-ink-700 px-4 py-3">
          <span v-for="n in 3" :key="n" class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" :style="{ animationDelay: (n - 1) * 0.15 + 's' }"></span>
        </div>
      </div>
    </div>

    <MessageInput @send="send" />
  </div>
</template>
