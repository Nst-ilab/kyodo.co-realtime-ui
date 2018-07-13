import Vue from 'vue'
import Router from 'vue-router'
import Loading from '@/components/loading/Loading'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import SignUp from '@/components/signup/SignUp'
import ModUser from '@/components/moduser/ModUser'

/**
 *  Vue-Routerのロード
 */
Vue.use(Router)

/**
 *  Vue-Routerの設定
 */
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Loading',
      component: Loading
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/moduser',
      name: 'ModUser',
      component: ModUser
    }
  ]
})
