import { createRouter, createWebHistory } from 'vue-router'
import VProfileView from '@/views/VProfileView.vue'
import VListingView from '@/views/VListingView.vue'
import VMatchesView from '@/views/VMatchesView.vue'
import VRoomView from '@/views/VRoomView.vue'
import VEditProfileView from '@/views/VEditProfileView.vue'
import VEditRoomView from '@/views/VEditRoomView.vue'
import VSearchingView from '@/views/VSearchingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/profiles/:userId/:username', name: 'profiles', component: VProfileView },
    { path: '/listings/:userId', name: 'listings', component: VListingView },
    { path: '/matches/:userId', name: 'matches', component: VMatchesView },
    { path: '/rooms/:userId', name: 'rooms', component: VRoomView },
    { path: '/editProfile/:userId/:username', name: 'editProfile', component: VEditProfileView },
    { path: '/editRoom/:userId', name: 'editRoom', component: VEditRoomView },
    { path: '/searching/:userId', name: 'searching', component: VSearchingView },
  ]
})

export default router