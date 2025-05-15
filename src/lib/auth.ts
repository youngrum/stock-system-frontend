import { useAppStore } from '@/stores/useAppStore'
import api from '@/services/api'

export const loginWithCredentials = async (username: string, password: string): Promise<void> => {
  console.log(username);
  console.log(password);
  const response = await api.post('/login', { username, password })
  console.log('axios response:', response);
  // const token = response.data?.token
  const { token, authname } = response.data.data;
  if (!token) throw new Error('トークンが取得できませんでした')
  // トークンを保存
  useAppStore.getState().setToken(token)
  // ユーザー名を保存
  useAppStore.getState().setAuthName(authname)
  // ローカルストレージにも保存（任意）
  localStorage.setItem('authToken', token)
}

export const logout = () => {
  useAppStore.getState().clearToken()
  localStorage.removeItem('authToken')
}

export const getToken = () => {
  return useAppStore.getState().token || localStorage.getItem('authToken')
}
