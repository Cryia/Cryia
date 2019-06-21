import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/public/Layout' // 整体布局

Vue.use(Router)
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/Redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login'),
    meta: { title: 'A Powerful and Accessible Data Visualization Tool' },
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/AuthRedirect'),
    hidden: true
  },
  {
    path: '/404',
    component: Layout,
    children: [
      {
        path: '',
        name: '404',
        component: () => import('@/views/ErrorPage404'),
        meta: { title: '404' }
      }
    ],
    hidden: true
  },
  {
    path: '/401',
    component: Layout,
    children: [
      {
        path: '',
        name: '401',
        component: () => import('@/views/ErrorPage401'),
        meta: { title: '401' }
      }
    ],
    hidden: true
  },
  {
    path: '',
    redirect: '/project/all',
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('@/views/account/UserProfile'),
        meta: { title: '编辑资料', noCache: true, affix: true }
      }
    ],
    hidden: true
  },
  {
    path: '/preview/:hash',
    component: () => import('@/views/dashboard/Preview'),
    hidden: true
  },
  {
    path: '/dashboard/:hash',
    component: () => import('@/views/dashboard/Preview'),
    hidden: true
  },
  {
    path: '/edit/dashboard/:hash',
    component: () => import('@/views/dashboard/Designer'),
    hidden: true
  }
]

export const permissionRouterMap = [
  {
    path: '/template',
    component: Layout,
    redirect: '/template/index',
    meta: {
      title: 'template',
      icon: 'component',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        force: true,
        component: () => import('@/views/dashboard/Template.vue'),
        name: 'TemplateManage',
        meta: {
          title: '模板管理',
          roles: ['admin'], // or you can only set roles in sub nav
          noCache: true,
          affix: true
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
