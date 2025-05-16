"use client";
import { logout } from '@/lib/auth';
import { useAppStore } from '@/stores/useAppStore'
import { useRouter } from 'next/navigation';
import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn';
import { useState } from 'react';

type HeaderProps = {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
};

export default function Header({ onToggleSidebar, isSidebarOpen}: HeaderProps) {
  const authName = useAppStore((state) => state.authName);
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      logout();               // Zustandストアをクリア（persist対象も消える）
      router.push('/login');  // ログインページへリダイレクト
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow px-6 py-4 flex items-center justify-between z-100">
      {/* ハンバーガーメニュー */}
      <button
        className="text-2xl text-gray-700 hover:text-black"
        onClick={onToggleSidebar}
      >
        {isSidebarOpen ? "×" : "☰"}
      </button>

      <div className="text-sm text-gray-700 px-3 py-1">
      {isLoggedIn && (
      <button
          onClick={handleLogout}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-200 mr-5"
        >
          Logout
        </button>
      )}
      {authName}
      </div>
    </header>
  );
}