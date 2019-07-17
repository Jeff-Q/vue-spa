import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home'
import Login from './views/login'
import './assets/base.less'

import './API/'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
  ]
})

// 为路由对象添加beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // to 代表要访问的路径

  // 1 登录不拦截
  // 2 非登录 token 页面拦截
  //   2.1 有token 放行
  //   2.2 没有 token 强制跳转 到登录界面
  if (to.path === '/login') return next()

  const token = sessionStorage.getItem('token')
  if (!token) return next('/login')

  next()
})

export default router
