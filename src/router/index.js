// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { checkAdminAccess } from '../admin';
import AdminPanel from '../views/AdminPanel.vue';
import Cadastro from '../views/cadastro.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Ranking from '../views/Ranking.vue';

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
    meta: { requiresGuest: true } // Apenas usuários não logados
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro,
    meta: { requiresGuest: true } // Apenas usuários não logados
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: Ranking,
    meta: { requiresAuth: true } // Requer autenticação
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true } // Requer admin
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guard para rotas protegidas
router.beforeEach(async (to, from, next) => {

  // Aguardar um pouco para garantir que o auth store foi inicializado
  await new Promise(resolve => setTimeout(resolve, 50));

  let authStore;
  try {
    const { useAuthStore } = await import('../stores/auth');
    authStore = useAuthStore();
  } catch (error) {
    console.error('❌ Erro ao importar authStore:', error);
    next();
    return;
  }

  const isAuthenticated = authStore.isAuthenticated;
  const user = authStore.user;



  // Redirecionar usuários logados para longe de login/cadastro
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
    return;
  }

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
      const isAdmin = checkAdminAccess(user);
      if (!isAdmin) {
        next('/');
        return;
      }
    } catch (error) {
      console.error('❌ Erro ao verificar admin:', error);
      next('/');
      return;
    }
  }

  next();
});

export default router;