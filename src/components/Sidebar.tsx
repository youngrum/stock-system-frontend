"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { label: "入庫", path: "/inventory/receive" },
    { label: "出庫", path: "/inventory/dispatch" },
    { label: "発注登録", path: "/orders/new" },
    { label: "納品登録", path: "/orders/receive" },
    { label: "発注一覧", path: "/orders" },
  ];

  return (
    <aside className="w-48 bg-gray-200 h-screen p-4 hidden md:block">
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="bg-white text-gray-800 hover:bg-gray-100 rounded"
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}