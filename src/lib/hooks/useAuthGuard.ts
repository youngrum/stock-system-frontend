'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/useAppStore';

export const useAuthGuard = () => {
  const router = useRouter();
  const token = useAppStore((state) => state.token);
  const authName = useAppStore((state) => state.authName);

  const isLoggedIn = !!token && !!authName;

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  return isLoggedIn;
};
