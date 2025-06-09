// lib/hooks/useAuthGuard.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/useAppStore';

export const useAuthGuard = () => {
  const router = useRouter();
  // Zustandのストアから認証情報を取得
  const token = useAppStore((state) => state.token);
  const authName = useAppStore((state) => state.authName);
  // サーバーサイドではpersistもhasHydratedも存在しないのでfalseを返す
  const hasHydrated =
    typeof window !== 'undefined' && useAppStore.persist?.hasHydrated
      ? useAppStore.persist.hasHydrated() // Zustand persistの復元完了チェック
      : false;
  const isLoggedIn = !!token && !!authName;

  useEffect(() => {
    if (typeof window === 'undefined') return; // クライアントのみ実行
    if (!hasHydrated) return; // persist復元前は待機

    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, hasHydrated, router]);

  return hasHydrated && isLoggedIn;
};
