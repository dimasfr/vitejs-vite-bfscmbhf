<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLogo from '../components/AppLogo.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const canSubmit = computed(() => email.value.trim() !== '' && password.value !== '')

function submit() {
  if (!canSubmit.value) return
  if (auth.login(email.value, password.value)) router.push({ name: 'chats' })
}
</script>

<template>
  <main class="flex h-full flex-col justify-center px-6">
    <div class="mb-8 flex flex-col items-center gap-3 text-center">
      <AppLogo :size="64" :with-name="false" />
      <h1 class="text-3xl font-bold tracking-tight">Welcome to <span class="bg-gradient-to-r from-brand-300 to-fuchsia-400 bg-clip-text text-transparent">Chatly</span></h1>
      <p class="text-sm text-slate-400">Sign in to continue your conversations</p>
    </div>

    <form class="space-y-4 rounded-3xl bg-ink-800/80 p-6 ring-1 ring-white/10 backdrop-blur" @submit.prevent="submit">
      <label class="block text-sm">
        <span class="mb-1.5 block text-slate-300">Email</span>
        <input
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="chris_evans@example.com"
          class="w-full rounded-xl bg-ink-700 px-4 py-2.5 outline-none ring-1 ring-white/10 placeholder:text-slate-500 focus:ring-brand-500"
        />
      </label>
      <label class="block text-sm">
        <span class="mb-1.5 block text-slate-300">Password</span>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••"
          class="w-full rounded-xl bg-ink-700 px-4 py-2.5 outline-none ring-1 ring-white/10 placeholder:text-slate-500 focus:ring-brand-500"
        />
      </label>
      <button
        type="submit"
        :disabled="!canSubmit"
        class="w-full rounded-xl bg-gradient-to-r from-brand-600 to-fuchsia-600 py-2.5 font-semibold text-white shadow-lg shadow-brand-600/30 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Login
      </button>
    </form>
  </main>
</template>
