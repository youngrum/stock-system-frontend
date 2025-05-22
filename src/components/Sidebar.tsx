"use client";

import { useRouter } from "next/navigation";
import { PackagePlus, Truck, Search, Blocks } from "lucide-react";

type sideBarProps = {
  isSidebarOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isSidebarOpen }:sideBarProps) {
  const router = useRouter();
  // const pathname = usePathname();

  // const isInventory = pathname.startsWith("/inventory/search");
  // const isOrders = pathname.startsWith("/orders");


  const menuItems = [
    { label: "在庫登録(新規用)", path: "/inventory/new", icon: <Blocks size={18} /> },
    { label: "在庫一覧/検索", path: "/inventory", icon: <Search size={18} /> },
    { label: "トランザクション", path: "/inventory/transactions", icon: <Search size={18} /> },
    // { label: "発注登録", path: "/orders/new", icon: <FileText size={18} /> },
    // { label: "納品登録", path: "/orders/receive", icon: <PackagePlus size={18} /> },
    // { label: "発注一覧/検索", path: "/orders", icon: <ListOrdered size={18} /> },
  ];

  return (
  <aside
    className={`
      fixed left-0 top-16 z-30
      w-48 min-h-screen
      bg-[linear-gradient(to_bottom,_#3D00B8,_#3070C3)]
      text-white p-4
      transform transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      <div className="flex flex-col gap-2">
      {menuItems.map((item) => (
        <div key={item.path} className="relative group">
          <button
            onClick={() => router.push(item.path)}
            className="text-white my-2"
          >
            <p className="flex items-center">
              <span className="pr-2">{item.icon}</span>
              {item.label}
            </p>
          </button>

          {/* ツールチップ表示：在庫一覧/検索のときだけ */}
          {isSidebarOpen && item.label === "在庫一覧/検索" && (
            <div className="absolute left-full top-1/2 ml-2 transform -translate-y-1/2 w-max bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ul>
                <li className="flex items-center gap-2"><PackagePlus/>入庫処理</li>
                <li className="flex items-center gap-2"><Truck/>出庫処理</li>
              </ul>
            </div>
          )}
        </div>
      ))}
      </div>
    </aside>
  );
}