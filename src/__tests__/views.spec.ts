import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '../router'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'
import App from '../App.vue'

// mounts the whole app at a given path, logged in or not
async function setup(path: string, loggedIn = true) {
  sessionStorage.clear()
  const pinia = createPinia()
  setActivePinia(pinia)
  if (loggedIn) useAuthStore().login('chris_evans@example.com', 'pw')
  const router = createAppRouter(createMemoryHistory())
  router.push(path)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

beforeEach(() => sessionStorage.clear())

describe('LoginView', () => {
  it('shows errors and stays put when fields are empty', async () => {
    const { wrapper, router } = await setup('/login', false)
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('[data-test=email-error]').text()).toMatch(/required/)
    expect(wrapper.get('[data-test=password-error]').text()).toMatch(/required/)
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('rejects a malformed email', async () => {
    const { wrapper, router } = await setup('/login', false)
    await wrapper.get('#email').setValue('not-an-email')
    await wrapper.get('#password').setValue('secret')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('[data-test=email-error]').text()).toMatch(/valid/)
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('logs in and goes to the chat list with a title-cased name', async () => {
    const { wrapper, router } = await setup('/login', false)
    await wrapper.get('#email').setValue('chris_evans@example.com')
    await wrapper.get('#password').setValue('secret')
    await wrapper.get('form').trigger('submit')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('chats'))
    await flushPromises()
    expect(wrapper.text()).toContain('Chris Evans')
  })

  it('toggles password visibility', async () => {
    const { wrapper } = await setup('/login', false)
    const pw = wrapper.get('#password')
    expect(pw.attributes('type')).toBe('password')
    await wrapper.get('[aria-label="Show password"]').trigger('click')
    expect(pw.attributes('type')).toBe('text')
  })
})

describe('ChatListView', () => {
  it('lists all chats (20+)', async () => {
    const { wrapper } = await setup('/chats')
    expect(wrapper.findAll('li').length).toBeGreaterThanOrEqual(20)
  })

  it('filters live by name, shows "No results found", and clears', async () => {
    const { wrapper } = await setup('/chats')
    await wrapper.get('[aria-label="Search"]').trigger('click')
    const input = wrapper.get('input')

    await input.setValue('tom')
    const rows = wrapper.findAll('li')
    expect(rows).toHaveLength(1)
    expect(rows[0].text()).toContain('Tom Holland')

    await input.setValue('john cena')
    expect(wrapper.text()).toContain('No results found')

    await wrapper.get('[aria-label="Clear search"]').trigger('click')
    expect(wrapper.findAll('li').length).toBeGreaterThanOrEqual(20)
  })

  it('closing search resets the keyword', async () => {
    const { wrapper } = await setup('/chats')
    await wrapper.get('[aria-label="Search"]').trigger('click')
    await wrapper.get('input').setValue('tom')
    await wrapper.get('[aria-label="Close search"]').trigger('click')
    expect(useChatStore().keyword).toBe('')
    expect(wrapper.findAll('li').length).toBeGreaterThanOrEqual(20)
  })

  it('opens a chat when an item is clicked', async () => {
    const { wrapper, router } = await setup('/chats')
    await wrapper.get('li button').trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('chat'))
  })
})

describe('ChatDetailView', () => {
  it('shows the contact, day separators and clears unread', async () => {
    const { wrapper } = await setup('/chats/1')
    expect(wrapper.get('h1').text()).toBe('Tom Holland')
    const labels = wrapper.findAll('[data-test=day]').map((d) => d.text())
    expect(labels).toContain('Yesterday')
    expect(labels).toContain('Today')
    expect(useChatStore().getChat(1)!.unread).toBe(0)
  })

  it('sends on Enter as a right-aligned bubble and updates the store', async () => {
    const { wrapper } = await setup('/chats/1')
    const before = wrapper.findAll('[data-test=text]').length
    const input = wrapper.get('input[type=text]')
    await input.setValue('Hello from test')
    await input.trigger('keydown.enter')

    const texts = wrapper.findAll('[data-test=text]')
    expect(texts).toHaveLength(before + 1)
    expect(texts[texts.length - 1].text()).toBe('Hello from test')
    const bubble = texts[texts.length - 1].element.closest('.justify-end')
    expect(bubble).not.toBeNull()
    expect(wrapper.findAll('[data-test=sender]').at(-1)!.text()).toBe('Chris Evans')
    expect(useChatStore().getChat(1)!.messages.at(-1)!.text).toBe('Hello from test')
    expect(wrapper.find('[data-test=typing]').exists()).toBe(true)
  })

  it('redirects to the list for an unknown chat id', async () => {
    const { router } = await setup('/chats/9999')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('chats')
  })
})
