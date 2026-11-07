import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'

beforeEach(() => setActivePinia(createPinia()))

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
