<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLogo from '../components/AppLogo.vue'
import ChatListItem from '../components/ChatListItem.vue'
import SearchBar from '../components/SearchBar.vue'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'

const chatStore = useChatStore()
const auth = useAuthStore()
const router = useRouter()

const searching = ref(false)
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval>

// keep "just now" labels fresh
onMounted(() => (timer = setInterval(() => (now.value = Date.now()), 15_000)))
onBeforeUnmount(() => clearInterval(timer))

// leaving search mode resets the filter
watch(searching, (on) => {
  if (!on) chatStore.keyword = ''
})

function open(id: number) {
  router.push({ name: 'chat', params: { id } })
}
function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-ink-800/80 px-4 backdrop-blur">
      <SearchBar v-if="searching" v-model="chatStore.keyword" class="w-full" @close="searching = false" />
      <template v-else>
        <AppLogo />
        <div class="flex items-center gap-1">
          <button type="button" aria-label="Search" class="rounded-full p-2 text-slate-300 hover:bg-white/10" @click="searching = true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </button>
          <button type="button" :title="`Signed in as ${auth.name} — click to log out`" aria-label="Log out" class="rounded-full p-2 text-slate-300 hover:bg-white/10" @click="logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
          </button>
        </div>
      </template>
    </header>

    <p v-if="!searching" class="px-4 pb-1 pt-3 text-xs text-slate-500">Hi, {{ auth.name }} 👋</p>

    <ul v-if="chatStore.filtered.length" class="scroll-thin flex-1 divide-y divide-white/5 overflow-y-auto">
      <ChatListItem
        v-for="c in chatStore.filtered"
        :key="c.id"
        :chat="c"
        :now="now"
        :keyword="chatStore.keyword"
        @select="open"
      />
    </ul>
    <div v-else class="grid flex-1 place-items-center text-slate-400">
      <p class="font-semibold">No results found</p>
    </div>
  </div>
</template>
