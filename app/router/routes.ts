import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () => import('@/pages/Home.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/Home/HomePage.vue')
      },
      {
        path: 'create-room',
        component: () => import('@/pages/Home/CreateRoom.vue')
      }
    ]
  },
  {
    path: '/room/:roomId',
    component: () => import('@/pages/Room.vue'),
    props: true
  },
  {
    path: '/',
    redirect: '/home'
  }
];

export default routes;
