import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import PropertiesPage from '@/views/PropertiesPage.vue';
import PropertyDetailPage from '@/views/PropertyDetailPage.vue';
import CreatePropertyPage from '@/views/CreatePropertyPage.vue';
import FavoritesPage from '@/views/FavoritesPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import { getAuthToken } from '@/services/api';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/properties',
    name: 'Properties',
    component: PropertiesPage,
  },
  {
    path: '/properties/create',
    name: 'CreateProperty',
    component: CreatePropertyPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/properties/:id',
    name: 'PropertyDetail',
    component: PropertyDetailPage,
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const token = getAuthToken();
  if (to.meta.requiresAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
