import { boot } from 'quasar/wrappers';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({ baseURL: 'http://localhost:3000' });

export default boot(({ app }) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
