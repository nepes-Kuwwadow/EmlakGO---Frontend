import { ref, computed } from 'vue';
import { api, getAuthToken, setAuthToken, getStoredUser, setStoredUser } from '@/services/api';

const token = ref(getAuthToken());
const user = ref(getStoredUser());
const loading = ref(false);
const error = ref(null);

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(credentials) {
    loading.value = true;
    error.value = null;
    try {
      const data = await api.login(credentials);
      token.value = data.token;
      user.value = data.user;
      setAuthToken(data.token);
      setStoredUser(data.user);
      return data;
    } catch (err) {
      error.value = err.message || 'Giriş şowsuz tamamlandy';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(userData) {
    loading.value = true;
    error.value = null;
    try {
      const data = await api.register(userData);
      token.value = data.token;
      user.value = data.user;
      setAuthToken(data.token);
      setStoredUser(data.user);
      return data;
    } catch (err) {
      error.value = err.message || 'Hasap döretmek şowsuz boldy';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    try {
      if (token.value) {
        await api.logout().catch(() => {});
      }
    } finally {
      token.value = null;
      user.value = null;
      setAuthToken(null);
      setStoredUser(null);
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return null;
    try {
      const data = await api.getMe();
      user.value = data.user;
      setStoredUser(data.user);
      return data.user;
    } catch {
      // Token expired or invalid
      token.value = null;
      user.value = null;
      setAuthToken(null);
      setStoredUser(null);
      return null;
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
  };
}
