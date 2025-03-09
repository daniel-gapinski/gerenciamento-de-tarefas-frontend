import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import { useAuthStore } from '@/store/auth';
import Register from '@/views/Register.vue';

const routes = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component:
    Login
  },
  {
    path: '/register',
    component: Register
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.checkAuth(); // Verifica a autenticação antes de navegar

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login'); // Redireciona para login se não estiver autenticado
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/'); // Impede que usuários autenticados acessem a página de login
  } else if(to.path === '/register' && authStore.isAuthenticated) {
    next("/");
  }
  else {
    next();
  }
});

export default router;
