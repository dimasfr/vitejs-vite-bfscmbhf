<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from '../components/Avatar.vue'
import MessageBubble from '../components/MessageBubble.vue'
import MessageInput from '../components/MessageInput.vue'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'

const props = defineProps<{ id: string }>()
const router = useRouter()
const auth = useAuthStore()
const chatStore = useChatStore()

const chat = computed(() => chatStore.getChat(Number(props.id)))
const list = ref<HTMLElement>()

function scrollBottom() {
  nextTick(() => list.value && (list.value.scrollTop = list.value.scrollHeight))
}

// guard unknown ids, and clear unread whenever this chat is open
watch(
  () => props.id,
  () => {
    if (!chat.value) return router.replace({ name: 'chats' })
    chatStore.markRead(chat.value.id)
  },
  { immediate: true },
)
// auto scroll on new messages
watch(() => chat.value?.messages.length, scrollBottom)
onMounted(scrollBottom)

function send(text: string) {
  if (chat.value) chatStore.send(chat.value.id, text)
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
        <p class="flex items-center gap-1 text-xs text-emerald-400"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>Online</p>
      </div>
    </header>

    <div ref="list" class="scroll-thin flex-1 space-y-3 overflow-y-auto px-4 py-4">
      <MessageBubble
        v-for="m in chat.messages"
        :key="m.id"
        :message="m"
        :sender-name="m.from === 'me' ? auth.name : chat.contact.name"
      />
    </div>

    <MessageInput @send="send" />
  </div>
</template>
