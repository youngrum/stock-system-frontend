// src/app/page.tsx
"use client";
import { useAppStore } from "@/stores/useAppStore";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const authName = useAppStore((state) => state.authName);
  const isLoggedIn = useAuthGuard();


  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex bg-white w-full justify-center p-8">
      {/* 左カラム：リンクボタン */}
      <div className="w-1/3 space-y-4">
        {[
          { label: "在庫登録(新規用)", path: "/inventory/new" },
          { label: "在庫一覧・検索(入庫・出庫)", path: "/inventory" },
          { label: "トランザクション", path: "/inventory/transactions" },
          { label: "発注登録", path: "/order" },
          { label: "発注履歴・検索・納品登録", path: "/order-history" },
        ].map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className="block bg-[#0d113d] text-white py-3 px-6 rounded text-center hover:bg-[#1b215e]"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* 右カラム：ユーザー表示 */}
      <div className="hidden md:flex w-1/2 items-center justify-center max-w-md">
        <div className="text-center">
          <p className="text-2xl font-semibold">ようこそ</p>
          <p className="text-4xl font-bold mt-2">{authName}さん</p>
        </div>
      </div>
    </div>
  );
}
