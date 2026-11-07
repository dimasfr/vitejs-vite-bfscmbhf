import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { nameFromEmail } from '../utils/format'

const KEY = 'chatly:session'

// sessionStorage can throw (private mode, blocked storage) — never let it break the app
function readSession(): string {
  try {
    return sessionStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}
function writeSession(email: string) {
  try {
    if (email) sessionStorage.setItem(KEY, email)
    else sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

export const useAuthStore = defineStore('auth', () => {
  const saved = readSession()
  const email = ref(saved)
  const name = ref(saved ? nameFromEmail(saved) : '')
  const isLoggedIn = computed(() => !!email.value)

  function login(e: string, password: string): boolean {
    if (!e.trim() || !password) return false
    email.value = e.trim()
    name.value = nameFromEmail(e)
    writeSession(email.value)
    return true
  }
  function logout() {
    email.value = ''
    name.value = ''
    writeSession('')
  }
  return { email, name, isLoggedIn, login, logout }
})
