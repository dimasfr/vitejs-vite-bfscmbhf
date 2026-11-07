import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { buildDummyChats } from '../data/chats'
import type { Chat } from './types'

const lastAt = (c: Chat) => c.messages[c.messages.length - 1].at

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>(buildDummyChats())
  const keyword = ref('')

  const sorted = computed(() => [...chats.value].sort((a, b) => lastAt(b) - lastAt(a)))
  const filtered = computed(() => {
    const k = keyword.value.trim().toLowerCase()
    return k ? sorted.value.filter((c) => c.contact.name.toLowerCase().includes(k)) : sorted.value
  })

  const getChat = (id: number) => chats.value.find((c) => c.id === id)

  function markRead(id: number) {
    const c = getChat(id)
    if (c) c.unread = 0
  }
  function send(id: number, text: string): boolean {
    const t = text.trim()
    const c = getChat(id)
    if (!t || !c) return false
    c.messages.push({ id: `${id}-${Date.now()}-${c.messages.length}`, from: 'me', text: t, at: Date.now() })
    return true
  }
  return { chats, keyword, filtered, getChat, markRead, send }
})
