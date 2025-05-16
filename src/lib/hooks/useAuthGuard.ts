// lib/hooks/useAuthGuard.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/useAppStore';

export const useAuthGuard = () => {
  const router = useRouter();

  const token = useAppStore((state) => state.token);
  const authName = useAppStore((state) => state.authName);
  const hasHydrated = useAppStore.persist.hasHydrated(); // ✅ Zustand persistの復元完了チェック

  const isLoggedIn = !!token && !!authName;

  useEffect(() => {
    if (!hasHydrated) return; // persist復元前は待機

    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, hasHydrated, router]);

  return hasHydrated && isLoggedIn;
};
