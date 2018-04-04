import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/components/Login'
import MainList from '@/components/MainList';
import Main from '@/components/Main';

Vue.use(Router);

export default new Router({
  routes: [
    // TODO main annotator in test
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    // Annotation List page
    {
      path: '/list',
      name: 'List',
      component: MainList
    },
    // Login page
    {
      path: '/login_test',
      name: 'Login',
      component: Login
    }
  ]
})
