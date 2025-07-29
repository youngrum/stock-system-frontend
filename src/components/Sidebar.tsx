"use client";

import { useRouter } from "next/navigation";
import {
  Search,
  Blocks,
  FileText,
  ListOrdered,
} from "lucide-react";

type sideBarProps = {
  isSidebarOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isSidebarOpen }: sideBarProps) {
  const router = useRouter();

  const menuItems = [
    {
      label: "在庫登録(新規用)",
      path: "/inventory/new",
      icon: <Blocks size={18} />,
    },
    {
      label: "在庫一覧/検索",
      path: "/inventory",
      icon: <ListOrdered size={18} />,
    },
    {
      label: "入出庫処理履歴/検索",
      path: "/inventory/transactions",
      icon: <Search size={18} />,
    },
    {
      label: "発注登録",
      path: "/order",
      icon: <FileText size={18} />,
    },
    {
      label: "発注履歴一覧/検索",
      path: "/order/order-list",
      icon: <ListOrdered size={18} />,
    },
    { label: "設備一覧/検索", path: "/asset", icon: <ListOrdered size={18} /> },
  ];

  return (
    <aside
      className={`
        fixed left-0 pt-20 z-30
        w-60 min-h-screen
        bg-[linear-gradient(to_bottom,_#3D00B8,_#3070C3)]
        text-white p-4
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isDisabled = "";
          return (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
              }}
              className={`
                text-white my-2 flex items-center
                ${isDisabled ? "opacity-50 line-through" : "hover:opacity-80"}
              `}
            >
              <span className="pr-2">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
