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
        path: 'app-config',
        component: () => import('@/pages/Home/AppConfig.vue')
      },
      {
        path: 'create-room',
        component: () => import('@/pages/Home/CreateRoom.vue')
      },
      {
        path: 'join-room',
        component: () => import('@/pages/Home/JoinRoom.vue')
      }
    ]
  },
  {
    path: '/room',
    component: () => import('@/pages/Room.vue')
  },
  {
    path: '/',
    redirect: '/home'
  }
];

export default routes;
