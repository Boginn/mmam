import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/match/:id',
    name: 'Match',
    component: () => import('../views/Match.vue')
  },
  {
    path: '/squad/:id',
    name: 'FIGHTER',
    component: () => import('../components/Unit.vue')
  },

  {
    path: '/league/:id',
    name: 'CLUB',
    component: () => import('../components/Club.vue')
  },
  {
    path: '/squad',
    name: 'Squad',
    component: () => import('../views/Squad.vue')
  },
  {
    path: '/training',
    name: 'Training',
    component: () => import('../views/Training.vue')
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('../views/Schedule.vue')
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('../views/News.vue')
  },
  {
    path: '/staff',
    name: 'Staff',
    component: () => import('../views/Staff.vue')
  },
  // {
  //   path: '/tactics/:id',
  //   name: 'Tactics',
  //   component: () => import('../views/Tactics.vue')
  // },
  {
    path: '/tactics',
    name: 'Tactics',
    component: () => import('../views/Tactics.vue')
  },
  {
    path: '/league',
    name: 'League',
    component: () => import('../views/League.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
