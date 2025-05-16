'use client';

import { useAppStore } from '@/stores/useAppStore';

export const useIsLoggedIn = () => {
  const token = useAppStore((state) => state.token);
  const authName = useAppStore((state) => state.authName);

  return !!token && !!authName;
};
