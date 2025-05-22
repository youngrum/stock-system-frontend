"use client";
import { logout } from '@/lib/auth';
import { useAppStore } from '@/stores/useAppStore'
import { useRouter } from 'next/navigation';
import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn';
import { Menu, X } from 'lucide-react';

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
        className={`text-2xl text-gray-700 hover:text-black transition-transform duration-300 ${
          isSidebarOpen ? "rotate-180" : "rotate-0"
        }`}
        onClick={onToggleSidebar}
      >
        {isSidebarOpen ? <X className="text-[#0d113d]" /> : <Menu className="text-[#0d113d]" />}
      </button>

      <div className="text-sm px-3 py-1">
      {isLoggedIn && (
      <button
          onClick={handleLogout}
          className="text-white bg-gradient-to-b from-gray-600 to-gray-400 px-3 py-1 rounded hover:opacity-80 mr-5"
        >
          Logout
        </button>
      )}
      <span className="text-[#0d113d] font-semibold">{authName}</span>
      </div>
    </header>
  );
}