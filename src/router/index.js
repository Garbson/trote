import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Cadastro from '../views/cadastro.vue';

// Importação lazy para Ranking
const Ranking = () => import('../views/Ranking.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro,
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: Ranking,
    meta: { requiresAuth: false } // Ranking pode ser público
  },
  {
    path: '/colecao',
    name: 'Colecao',
    component: Home, // Por enquanto redireciona para Home
    meta: { requiresAuth: true }
  },
  // Redirect para login se rota não encontrada
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guard de navegação global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Aguarda a inicialização da auth store se necessário
  if (!authStore.user && !authStore.session) {
    await new Promise(resolve => {
      const unsubscribe = authStore.$subscribe((mutation, state) => {
        if (state.user !== null || state.session !== null) {
          unsubscribe();
          resolve();
        }
      });

      // Timeout para evitar espera infinita
      setTimeout(() => {
        unsubscribe();
        resolve();
      }, 2000);
    });
  }

  const isAuthenticated = authStore.isAuthenticated;
  const requiresAuth = to.meta.requiresAuth;
  const redirectIfAuth = to.meta.redirectIfAuth;

  // Se a rota requer autenticação e o usuário não está logado
  if (requiresAuth && !isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // Se o usuário está logado e tenta acessar login/cadastro
  if (redirectIfAuth && isAuthenticated) {
    const redirectTo = to.query.redirect || '/';
    next(redirectTo);
    return;
  }

  next();
});

export default router;