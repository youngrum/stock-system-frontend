"use client";

import { useRouter } from "next/navigation";
import { PackagePlus, Truck, Search } from "lucide-react";

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
    { label: "入庫登録", path: "/inventory", icon: <PackagePlus size={18} /> },
    { label: "出庫登録", path: "/inventory", icon: <Truck size={18} /> },
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
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="text-white my-2" 
          ><p className="flex items-center">
            <span className="pr-2 al">{item.icon}</span>
            {item.label}
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
}