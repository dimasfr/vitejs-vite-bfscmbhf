import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { buildDummyChats } from '../data/chats'
import type { Chat } from './types'

const lastAt = (c: Chat) => c.messages[c.messages.length - 1].at

const REPLIES = [
  'Haha, nice one 😄',
  'Got it, thanks!',
  'Sounds good to me.',
  "Let me think about it and get back to you.",
  'Interesting... tell me more!',
  'Sure thing 👍',
  "I'm on it.",
  'Absolutely!',
  'Ha, that made my day.',
  'Can we talk about it later?',
]

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>(buildDummyChats())
  const keyword = ref('')
  const activeId = ref<number | null>(null) // chat currently open on screen
  const typing = ref<Record<number, boolean>>({})
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  let replyCount = 0

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
  function setActive(id: number | null) {
    activeId.value = id
  }
  function send(id: number, text: string): boolean {
    const t = text.trim()
    const c = getChat(id)
    if (!t || !c) return false
    c.messages.push({ id: `${id}-${Date.now()}-${c.messages.length}`, from: 'me', text: t, at: Date.now() })
    return true
  }

  /** Simulates the contact typing, then replying. Safe to call repeatedly. */
  function scheduleReply(id: number, delay = 1000 + Math.random() * 1500) {
    const c = getChat(id)
    if (!c) return
    clearTimeout(timers.get(id))
    typing.value[id] = true
    timers.set(
      id,
      setTimeout(() => {
        typing.value[id] = false
        timers.delete(id)
        c.messages.push({
          id: `${id}-r${Date.now()}-${c.messages.length}`,
          from: 'them',
          text: REPLIES[replyCount++ % REPLIES.length],
          at: Date.now(),
        })
        if (activeId.value !== id) c.unread++
      }, delay),
    )
  }

  return { chats, keyword, typing, activeId, filtered, getChat, markRead, setActive, send, scheduleReply }
})
