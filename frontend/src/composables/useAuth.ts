import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { authApi } from '@/api/auth.api'
import { useSnackbar } from './useSnackbar'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  const { snackbar, snackbarText, snackbarColor, showSuccess, showError } = useSnackbar()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      
      authStore.setAuth(response.access_token, {
        id: response.user.id,
        email: response.user.email,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      showSuccess('Login realizado com sucesso!')
      router.push('/documents')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Erro ao fazer login'
      showError(errorMessage)
      throw error
    }
  }

  const logout = () => {
    authStore.logout()
    router.push('/login')
    showSuccess('Logout realizado com sucesso!')
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    snackbar,
    snackbarText,
    snackbarColor
  }
}

