import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user.types'
import { tokenUtil } from '@/utils/token.util'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(tokenUtil.getToken())
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const setAuth = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser
    tokenUtil.setToken(newToken)
  }

  const logout = () => {
    token.value = null
    user.value = null
    tokenUtil.removeToken()
  }

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    logout
  }
})

