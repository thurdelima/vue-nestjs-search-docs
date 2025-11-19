import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
}

export const guestGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    next('/documents')
  } else {
    next()
  }
}

