import { createRouter, createWebHistory } from 'vue-router'
import IntroductionPage from '../pages/IntroductionPage.vue'
import HomePage from '../pages/HomePage.vue'
import SignInPage from '../pages/SignInPage.vue'
import { SessionStore } from '@/stores/SessionStore'
import { storeToRefs } from 'pinia'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      // Add a redirect to into page if not signed in
      path: '/',
      name: 'home',
      component: HomePage,
      beforeEnter: (to, from) => {
        const {checkSession} = storeToRefs(SessionStore())
        if(checkSession.value !== "ok" && to.name !== 'introduction')
          return {name : 'introduction'}
      }
    },
    {
      path: '/introduction',
      name: 'introduction',
      component: IntroductionPage
    },
    {
      path: '/signin',
      name: 'Signin',
      component: SignInPage
    }
  ]
})

export default router
