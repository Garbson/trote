// src/router/index.js
import Cookies from 'js-cookie';
import { createRouter, createWebHistory } from 'vue-router';
import { checkAdminAccess } from '../admin';
import AdminPanel from '../views/AdminPanel.vue';
import Cadastro from '../views/cadastro.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro,
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    // meta: {
    //   requiresAuth: true,
    //   requiresAdmin: true
    // }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guard para rotas protegidas
router.beforeEach((to, from, next) => {
  const user = Cookies.get('user');
  const isAuthenticated = !!user;

  // Verificar se a rota requer autenticação
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // Verificar se a rota requer admin
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated) {
      next('/login');
      return;
    }

    try {
      const userData = JSON.parse(user);
      // Usar a configuração centralizada de admin
      const isAdmin = checkAdminAccess(userData);

      if (!isAdmin) {
        // Redireciona para home se não for admin
        next('/');
        return;
      }
    } catch (error) {
      next('/login');
      return;
    }
  }

  next();
});

export default router;