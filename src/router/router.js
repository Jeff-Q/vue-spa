import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Login from '../views/login'
import '../API/'
import '../assets/base.less'
import welcome from '../views/home/welcome'
import users from '../views/users/users'
import Right from '../views/power/rights'
import Roles from '../views/power/roles'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
Vue.use(Router)
const router = new Router({
    routes: [{
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect: '/home/welcome',
            children: [{
                    path: '/home/welcome',
                    component: welcome
                },
                {
                    path: '/users',
                    component: users
                },
                {
                    path: '/rights',
                    component: Right
                },
                {
                    path: '/roles',
                    component: Roles
                },
                {
                    path: '/categories',
                    component: Cate
                },
                {
                    path: '/params',
                    component: Params
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const token = sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
})

export default router