import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DocumentsView from '@/views/DocumentsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/documents'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter: guestGuard
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    beforeEnter: guestGuard
  },
  {
    path: '/documents',
    name: 'Documents',
    component: DocumentsView,
    beforeEnter: authGuard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

