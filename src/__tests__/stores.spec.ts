import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'

beforeEach(() => {
  sessionStorage.clear()
  setActivePinia(createPinia())
})

describe('auth store', () => {
  it('rejects empty email or password', () => {
    const a = useAuthStore()
    expect(a.login('', 'x')).toBe(false)
    expect(a.login('a@b.c', '')).toBe(false)
    expect(a.isLoggedIn).toBe(false)
  })
  it('logs in and derives the name', () => {
    const a = useAuthStore()
    expect(a.login('chris_evans@example.com', 'pw')).toBe(true)
    expect(a.name).toBe('Chris Evans')
  })
})

describe('chat store', () => {
  it('has at least 20 chats', () => {
    expect(useChatStore().chats.length).toBeGreaterThanOrEqual(20)
  })
  it('filters by name as keyword changes', () => {
    const s = useChatStore()
    s.keyword = 'tom'
    expect(s.filtered.map((c) => c.contact.name)).toContain('Tom Holland')
    s.keyword = 'zzzz'
    expect(s.filtered).toHaveLength(0)
  })
  it('sends a message, moves chat to top, ignores blanks', () => {
    const s = useChatStore()
    const id = s.chats[10].id
    expect(s.send(id, '   ')).toBe(false)
    expect(s.send(id, ' hello ')).toBe(true)
    expect(s.filtered[0].id).toBe(id)
    const last = s.getChat(id)!.messages.at(-1)!
    expect(last.text).toBe('hello')
    expect(last.from).toBe('me')
  })
  it('marks as read', () => {
    const s = useChatStore()
    const c = s.chats.find((x) => x.unread > 0)!
    s.markRead(c.id)
    expect(c.unread).toBe(0)
  })
})

import { vi } from 'vitest'

describe('auto reply', () => {
  it('shows typing, then replies and bumps unread when chat is not open', () => {
    vi.useFakeTimers()
    const s = useChatStore()
    const c = s.chats[3]
    const before = c.messages.length
    const unread = c.unread
    s.scheduleReply(c.id, 1000)
    expect(s.typing[c.id]).toBe(true)
    vi.advanceTimersByTime(1000)
    expect(s.typing[c.id]).toBe(false)
    expect(c.messages.length).toBe(before + 1)
    expect(c.messages.at(-1)!.from).toBe('them')
    expect(c.unread).toBe(unread + 1)
    vi.useRealTimers()
  })
  it('does not bump unread while the chat is open', () => {
    vi.useFakeTimers()
    const s = useChatStore()
    const c = s.chats[4]
    s.setActive(c.id)
    s.scheduleReply(c.id, 500)
    vi.advanceTimersByTime(500)
    expect(c.unread).toBe(0)
    vi.useRealTimers()
  })
})
