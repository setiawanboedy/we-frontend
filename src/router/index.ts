import WindowsExplorerView from '@/presentation/views/WindowsExplorerView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'explorer',
      component: WindowsExplorerView,
    },
    
  ],
})

export default router
