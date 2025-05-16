"use client";
import { useAppStore } from '@/stores/useAppStore'

type HeaderProps = {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
};

export default function Header({ onToggleSidebar, isSidebarOpen}: HeaderProps) {
  const authName = useAppStore((state) => state.authName);
  return (
    <header className="w-full bg-white shadow px-6 py-4 flex items-center justify-between">
      {/* ハンバーガーメニュー */}
      <button
        className="text-2xl text-gray-700 hover:text-black"
        onClick={onToggleSidebar}
      >
        {isSidebarOpen ? "×" : "☰"}
      </button>

      {/* ユーザー名（仮表示） */}
      <div className="text-sm text-gray-700 px-3 py-1">
        {authName}
      </div>
    </header>
  );
}