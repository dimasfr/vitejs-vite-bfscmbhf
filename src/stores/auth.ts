import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { nameFromEmail } from '../utils/format'

export const useAuthStore = defineStore('auth', () => {
  const email = ref('')
  const name = ref('')
  const isLoggedIn = computed(() => !!email.value)

  function login(e: string, password: string): boolean {
    if (!e.trim() || !password) return false
    email.value = e.trim()
    name.value = nameFromEmail(e)
    return true
  }
  function logout() {
    email.value = ''
    name.value = ''
  }
  return { email, name, isLoggedIn, login, logout }
})
