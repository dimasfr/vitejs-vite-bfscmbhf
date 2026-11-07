import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatListItem from '../components/ChatListItem.vue'
import MessageInput from '../components/MessageInput.vue'
import SearchBar from '../components/SearchBar.vue'
import type { Chat } from '../stores/types'

const now = Date.now()
const chat: Chat = {
  id: 7,
  unread: 3,
  contact: { name: 'Tom Holland', avatar: 'x.jpg' },
  messages: [{ id: 'a', from: 'them', text: 'Hi there', at: now - 5_000 }],
}

describe('ChatListItem', () => {
  it('renders name, preview, unread and "just now"', () => {
    const w = mount(ChatListItem, { props: { chat, now } })
    expect(w.get('[data-test=name]').text()).toBe('Tom Holland')
    expect(w.get('[data-test=preview]').text()).toBe('Hi there')
    expect(w.get('[data-test=unread]').text()).toBe('3')
    expect(w.get('[data-test=time]').text()).toBe('just now')
  })
  it('emits select with the id', async () => {
    const w = mount(ChatListItem, { props: { chat, now } })
    await w.get('button').trigger('click')
    expect(w.emitted('select')![0]).toEqual([7])
  })
})

describe('MessageInput', () => {
  it('emits send on enter and clears the field', async () => {
    const w = mount(MessageInput)
    const input = w.get('input')
    await input.setValue('  hello ')
    await input.trigger('keydown.enter')
    expect(w.emitted('send')![0]).toEqual(['hello'])
    expect((input.element as HTMLInputElement).value).toBe('')
  })
  it('does not emit for blank text', async () => {
    const w = mount(MessageInput)
    await w.get('input').trigger('keydown.enter')
    expect(w.emitted('send')).toBeUndefined()
  })
})

describe('SearchBar', () => {
  it('emits update:modelValue while typing and can clear', async () => {
    const w = mount(SearchBar, { props: { modelValue: 'to' } })
    await w.get('input').setValue('tom')
    expect(w.emitted('update:modelValue')![0]).toEqual(['tom'])
    await w.get('[aria-label="Clear search"]').trigger('click')
    expect(w.emitted('update:modelValue')![1]).toEqual([''])
  })
})
