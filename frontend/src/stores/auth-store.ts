import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access_token') || '');
  const user = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(username: string, pass: string) {
    try {
      const response = await api.post('http://localhost:3000/auth/login', {
        username,
        password: pass,
      });

      token.value = response.data.access_token;
      localStorage.setItem('access_token', token.value);

      return true;
    } catch (error) {
      console.error('Login falhou', error);
      throw error;
    }
  }

  function logout() {
    token.value = '';
    localStorage.removeItem('access_token');
  }

  return { token, user, isAuthenticated, login, logout };
});
