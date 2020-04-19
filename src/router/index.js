import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout/index.vue'
import calcRoute from '../views/calcRoute/index.vue'
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
        meta: { title: '团队信息', icon: 'iconfont icon-index' },
        component: () => import('@/views/TeamInfo.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'calcRouteP',
    component: Layout,
    hidden: true,
    redirect: '/calcRoute',
    children: [
      {
        path: '/calcRoute',
        name: "calcRoute",
        meta: { title: '路线计算', icon: 'iconfont icon-route' },
        component: calcRoute
      }
    ]
  },
  {
    path: '/',
    name: 'resHistoryP',
    component: Layout,
    hidden: true,
    redirect: '/resHistory',
    children: [
      {
        path: '/resHistory',
        name: "resHistory",
        meta: { title: '历史结果', icon: 'iconfont icon-lishijilu' },
        component: () => import('@/views/ResHistory.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'uploadP',
    component: Layout,
    hidden: true,
    redirect: '/upload',
    children: [
      {
        path: '/upload',
        name: "upload",
        meta: { title: '地图节点录入', icon: 'iconfont icon-Excel' },
        component: () => import('@/views/File/uploadTest.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'nodelist',
    component: Layout,
    hidden: true,
    redirect: '/nodelist',
    children: [
      {
        path: '/nodelist',
        name: "nodelist",
        meta: { title: '地图管理', icon: 'iconfont icon-node1' },
        component: () => import('@/views/NodeList/index.vue')
      }
    ]
  },


  // {
  //   path: '/testroute',
  //   name: 'testroute',
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: '测试路由', icon: 'iconfont icon-peisong2' },
  //   redirect: '/testroute1',
  //   children: [
  //     {
  //       path: '/testroute1',
  //       name: "testroute1",
  //       meta: { title: '测试路由2', icon: 'iconfont icon-peisong3' },
  //       component: () => import('@/views/404.vue')
  //     },
  //     // {
  //     //   path: '/plan1',
  //     //   name: "plan1",
  //     //   meta: { title: 'plan1', icon: 'iconfont icon-zuobiao1' },
  //     //   component: () => import('@/components/RouteGraph/index.vue')
  //     // },
  //     {
  //       path: '/plan2',
  //       name: "plan2",
  //       meta: { title: 'plan2', icon: 'iconfont icon-zuobiao1' },
  //       component: () => import('@/components/RouteGraph/index2.vue')
  //     },
  //     {
  //       path: '/uploadtest',
  //       name: "uploadtest",
  //       meta: { title: '地图节点录入', icon: 'iconfont icon-Excel' },
  //       component: () => import('@/views/File/uploadTest.vue')
  //     }, {
  //       path: '/nodelist',
  //       name: "nodelist",
  //       meta: { title: '地图管理', icon: 'iconfont icon-node1' },
  //       component: () => import('@/views/NodeList/index.vue')
  //     },
  //     {
  //       path: '/calcRoute',
  //       name: "calcRoute",
  //       meta: { title: '路线计算', icon: 'iconfont icon-route' },
  //       component: () => import('@/views/calcRoute/index.vue')
  //     }
  //   ]

  // },
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
