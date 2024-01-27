import { createRouter, createWebHistory } from 'vue-router'
import VProfileView from '@/views/VProfileView.vue'
import VListingView from '@/views/VListingView.vue'
import VMatchesView from '@/views/VMatchesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/profiles/:userId', name: 'profiles', component: VProfileView },
    { path: '/listings/:userId', name: 'listings', component: VListingView },
    { path: '/matches/:userId', name: 'matches', component: VMatchesView }
  ]
})

export default router
