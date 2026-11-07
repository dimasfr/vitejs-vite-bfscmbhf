import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '../router'
import { useAuthStore } from '../stores/auth'
import { validateEmail, validatePassword } from '../utils/validate'

beforeEach(() => {
  sessionStorage.clear()
  setActivePinia(createPinia())
})

describe('router guard', () => {
  it('redirects guests to /login', async () => {
    const r = createAppRouter(createMemoryHistory())
    await r.push('/chats')
    expect(r.currentRoute.value.name).toBe('login')
    await r.push('/chats/3')
    expect(r.currentRoute.value.name).toBe('login')
  })

  it('lets a logged-in user in and keeps them off /login', async () => {
    useAuthStore().login('chris_evans@example.com', 'pw')
    const r = createAppRouter(createMemoryHistory())
    await r.push('/chats/3')
    expect(r.currentRoute.value.name).toBe('chat')
    await r.push('/login')
    expect(r.currentRoute.value.name).toBe('chats')
  })

  it('redirects / to the chat list', async () => {
    useAuthStore().login('a@b.co', 'pw')
    const r = createAppRouter(createMemoryHistory())
    await r.push('/')
    expect(r.currentRoute.value.name).toBe('chats')
  })
})

describe('session persistence', () => {
  it('restores the user after a "refresh" (new store instance)', () => {
    useAuthStore().login('chris_evans@example.com', 'pw')
    setActivePinia(createPinia())
    const a = useAuthStore()
    expect(a.isLoggedIn).toBe(true)
    expect(a.name).toBe('Chris Evans')
  })
  it('clears the session on logout', () => {
    useAuthStore().logout()
    setActivePinia(createPinia())
    expect(useAuthStore().isLoggedIn).toBe(false)
  })
})

describe('validators', () => {
  it('validates email', () => {
    expect(validateEmail('')).toMatch(/required/)
    expect(validateEmail('nope')).toMatch(/valid/)
    expect(validateEmail('a@b')).toMatch(/valid/)
    expect(validateEmail('chris_evans@example.com')).toBe('')
  })
  it('validates password', () => {
    expect(validatePassword('')).toMatch(/required/)
    expect(validatePassword('x')).toBe('')
  })
})
