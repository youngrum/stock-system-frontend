import axios from 'axios'
import { getToken } from '@/lib/auth'
import { useAppStore } from '@/stores/useAppStore';

const api = axios.create({
  baseURL: 'http://localhost:8080/v1/api', // 必要に応じて環境変数化可能
  headers: {
    'Content-Type': 'application/json',
  },
})

// リクエスト前にトークンを自動挿入
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


// interceptorsは一度だけグローバル設定
api.interceptors.response.use(
  response => response,
  error => {
    const isLoginRequest = error.config.url?.endsWith('/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      const { clearAuth } = useAppStore.getState();
      clearAuth();
      window.location.href = '/login'; // App Routerでも確実に遷移させる
    }
    return Promise.reject(error);
  }
);

export default api
