import { create } from 'zustand'
import { persist } from 'zustand/middleware';

interface AppState {
  token: string | null // 認証トークン
  authName: string | null // ログインユーザー名
  setToken: (token: string) => void // トークンの取得
  setAuthName: (authName: string) => void
  clearAuth: () => void // 認証情報解放
  // isSidebarOpen: boolean // サイドバーの開閉フラグ
  // toggleSidebar: () => void // サイドバーの開閉フラグ切り替え
}

export const useAppStore = create(
  persist(
    (set): AppState => ({
      authName: null,
      token: null,
      setAuthName: (authName) => set({ authName }),
      setToken: (token) => set({ token }),
      clearAuth: () => set({ authName: null, token: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state: AppState) => ({
        authName: state.authName,
        token: state.token,
      }),
    }
  )
);