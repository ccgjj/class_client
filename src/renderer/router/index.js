import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: require('@/components/login').default
    },
     {
       path: '/error',
       name: 'error',
       component: require('@/components/error').default
     }
  ]
})
