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
        meta: { title: '首页', icon: 'iconfont icon-xuanzhongshangcheng' },
        component: () => import('@/views/Home.vue')
      }
    ]
  },
  {
    path: '/testroute',
    name: 'testroute',
    component: Layout,
    hidden: true,
    meta: { title: '测试路由', icon: 'iconfont icon-peisong2' },
    redirect: '/testroute1',
    children: [
      {
        path: '/testroute1',
        name: "testroute1",
        meta: { title: '测试路由2', icon: 'iconfont icon-peisong3' },
        component: () => import('@/views/404.vue')
      },
      // {
      //   path: '/plan1',
      //   name: "plan1",
      //   meta: { title: 'plan1', icon: 'iconfont icon-zuobiao1' },
      //   component: () => import('@/components/RouteGraph/index.vue')
      // },
      {
        path: '/plan2',
        name: "plan2",
        meta: { title: 'plan2', icon: 'iconfont icon-zuobiao1' },
        component: () => import('@/components/RouteGraph/index2.vue')
      },
      {
        path: '/uploadtest',
        name: "uploadtest",
        meta: { title: 'Excel上传', icon: 'iconfont icon-zuobiao1' },
        component: () => import('@/components/File/uploadTest.vue')
      }, {
        path: '/nodelist',
        name: "nodelist",
        meta: { title: '节点管理', icon: 'iconfont icon-zuobiao1' },
        component: () => import('@/components/NodeList/index.vue')
      },
      {
        path: '/calcRoute',
        name: "calcRoute",
        meta: { title: '路线计算', icon: 'iconfont icon-zuobiao1' },
        component: () => import('@/components/calcRoute/index.vue')
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
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: RouterMap
})

export default router
