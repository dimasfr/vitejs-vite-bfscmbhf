import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export function createAppRouter(history: RouterHistory = createWebHistory()) {
  const router = createRouter({
    history,
    routes: [
      { path: '/', redirect: '/chats' },
      { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guest: true } },
      { path: '/chats', name: 'chats', component: () => import('../views/ChatListView.vue') },
      { path: '/chats/:id', name: 'chat', component: () => import('../views/ChatDetailView.vue'), props: true },
    ],
  })

  router.beforeEach((to) => {
    const auth = useAuthStore()
    if (!to.meta.guest && !auth.isLoggedIn) return { name: 'login' }
    if (to.meta.guest && auth.isLoggedIn) return { name: 'chats' }
  })

  return router
}

export default createAppRouter()
