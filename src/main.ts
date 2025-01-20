import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './styles/main.scss';
import { useAuthenticationStore } from './stores/authentication.store';

const app = createApp(App);
const pinia = createPinia();
const router = createRouter({
  routes: [
    {
      path: '/',
      component: () => import('./pages/Home.vue'),
    },
    {
      path: '/login',
      component: () => import('./pages/Authentication.vue'),
    },
  ],
  history: createWebHistory(),
});

router.beforeEach(async (to, _, next) => {
  const store = useAuthenticationStore();
  console.log('getting auth status');
  const isAuthenticated = await store.getAuthenicationStatus();

  if (!isAuthenticated && to.path !== '/login') {
    return next('/login');
  }

  if (isAuthenticated && to.path === '/login') {
    return next('/');
  }

  next();
});

app.use(pinia);
app.use(router);

app.mount('#app');
