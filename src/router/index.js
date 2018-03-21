import Vue from 'vue';
import Router from 'vue-router';

import TestAppMain from '@/components/test-framework/TestAppMain';
import TestAppMainSingle from '@/components/test-framework-single/TestAppMain';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TestMain',
      component: TestAppMainSingle
    },
    {
      path: '/test_app',
      name: 'TestApp',
      component: TestAppMain
    },
    {
      path: '/test_app_single',
      name: 'TestAppSingle',
      component: TestAppMainSingle
    }
  ]
})
