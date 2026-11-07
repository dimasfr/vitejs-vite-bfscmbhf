<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLogo from '../components/AppLogo.vue'
import { useAuthStore } from '../stores/auth'
import { validateEmail, validatePassword } from '../utils/validate'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
// errors only appear once a field was left or the form was submitted
const touched = reactive({ email: false, password: false })

const emailError = computed(() => (touched.email ? validateEmail(email.value) : ''))
const passwordError = computed(() => (touched.password ? validatePassword(password.value) : ''))

function submit() {
  touched.email = touched.password = true
  if (validateEmail(email.value) || validatePassword(password.value)) return
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

    <form class="space-y-4 rounded-3xl bg-ink-800/80 p-6 ring-1 ring-white/10 backdrop-blur" novalidate @submit.prevent="submit">
      <div class="text-sm">
        <label for="email" class="mb-1.5 block text-slate-300">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="chris_evans@example.com"
          :aria-invalid="!!emailError"
          aria-describedby="email-error"
          class="w-full rounded-xl bg-ink-700 px-4 py-2.5 outline-none ring-1 placeholder:text-slate-500 focus:ring-brand-500"
          :class="emailError ? 'ring-rose-500/70' : 'ring-white/10'"
          @blur="touched.email = true"
        />
        <p v-if="emailError" id="email-error" role="alert" class="mt-1.5 text-xs text-rose-400" data-test="email-error">{{ emailError }}</p>
      </div>

      <div class="text-sm">
        <label for="password" class="mb-1.5 block text-slate-300">Password</label>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••"
            :aria-invalid="!!passwordError"
            aria-describedby="password-error"
            class="w-full rounded-xl bg-ink-700 py-2.5 pl-4 pr-16 outline-none ring-1 placeholder:text-slate-500 focus:ring-brand-500"
            :class="passwordError ? 'ring-rose-500/70' : 'ring-white/10'"
            @blur="touched.password = true"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-3 text-xs font-medium text-slate-400 hover:text-white"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            :aria-pressed="showPassword"
            @click="showPassword = !showPassword"
          >{{ showPassword ? 'Hide' : 'Show' }}</button>
        </div>
        <p v-if="passwordError" id="password-error" role="alert" class="mt-1.5 text-xs text-rose-400" data-test="password-error">{{ passwordError }}</p>
      </div>

      <button
        type="submit"
        class="w-full rounded-xl bg-gradient-to-r from-brand-600 to-fuchsia-600 py-2.5 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:brightness-110"
      >
        Login
      </button>
    </form>
  </main>
</template>
