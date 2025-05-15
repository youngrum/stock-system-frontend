import { create } from 'zustand'

interface AppState {
  token: string | null // 認証トークン
  authName: string | null // ログインユーザー名
  isSidebarOpen: boolean // サイドバーの開閉フラグ
  toggleSidebar: () => void // サイドバーの開閉フラグ切り替え
  setToken: (token: string) => void // トークンの取得
  clearToken: () => void // トークン解放
  setAuthName: (authname: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isSidebarOpen: false,authName: null,
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
    console.log("setToken:"+ token)
  },
  clearToken: () => {
    localStorage.removeItem('token')
    set({ token: null })
  },
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
  },
  setAuthName: (authName) => {
    set({ authName })
    console.log("setToken:"+ authName)
  }
}))