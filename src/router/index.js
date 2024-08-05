import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Cookies from 'js-cookie';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
   
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});



export default router;
