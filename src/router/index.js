import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout/index.vue'
Vue.use(VueRouter)

export const RouterMap = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    hidden: true,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: '首页', icon: 'fa fa-home' },
        component: () => import('@/views/About.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    hidden: true,
    redirect: '/testroute',
    children: [
      {
        path: '/testroute',
        name: "testroute",
        meta: { title: '测试路由', icon: 'fa fa-home' },
        component: () => import('@/views/Home.vue')
      }
    ]

  },
  {
    path: '/404',
    name: '404',
    hidden: false,
    meta: { title: '404' },
    component: () => import('@/views/404.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: RouterMap
})

export default router
