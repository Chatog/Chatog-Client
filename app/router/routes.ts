import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/Home.vue')
  },
  {
    path: '/about',
    component: () => import('@/components/About.vue')
  }
];

export default routes;
