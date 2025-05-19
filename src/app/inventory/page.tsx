// inventory/page.tsx
"use client";

import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryReceiveModal from "@/components/inventory/InventoryReceiveModal";
import InventorySearchForm from "@/components/inventory/InventorySearchForm";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { InventoryItem } from "@/types/InventoryItem";
import { InventorySearchParams } from "@/types/InventoryItem";
import { useEffect, useState } from "react";
import Image from "next/image";

import api from "@/services/api";

export default function InventoryListsPage() {
  const isLoggedIn = useAuthGuard();
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSearchForm, setShowSearchForm] = useState(false);
  const toggleSearchForm = () => setShowSearchForm((prev) => !prev);
  const [searchParams, setSearchParams] = useState<InventorySearchParams>({
    itemCode: "",
    itemName: "",
    category: "",
    modelNumber: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const handleReceiveClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      try {
        const res = await api.get("/inventory/search", {
          params: searchParams,
        });
        console.log(res.data.data.content);
        setData(res.data.data.content); // ← ここがAPIのレスポンスに依存する（必要に応じて .data.content）
      } catch (err) {
        console.log(err);
        setError("在庫データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  return (
    <main className="bg-white border-gray-400 p-3 shadow mt-20">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-bold text-gray-800"
          style={{ color: "#101540" }}
        >
          在庫一覧・検索
        </h2>
        {/* 右側：検索ボタン＋在庫追加ボタン */}
        <div className="flex items-center space-x-3">
          {/* 🔍 検索マーク */}
          <button
            onClick={toggleSearchForm}
            className="text-[#101540] hover:text-indigo-600 text-xl focus:outline-none"
            aria-label="検索フォーム切り替え"
          >
            {showSearchForm ? (
              <Image
                src="/icon_x.svg"
                alt="close icon"
                width={20}
                height={20}
              />
            ) : (
              <Image
                src="/icon_search.svg"
                alt="search icon"
                className=""
                width={20}
                height={20}
              />
            )}
          </button>

          {/* 新規登録ボタン */}
          <button
            className="px-4 py-1 text-sm font-medium text-white rounded shadow-md"
            style={{
              background: "linear-gradient(to bottom, #3D00B8, #3070C3)",
            }}
          >
            ＋ 在庫新規登録
          </button>
        </div>
      </div>
      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${showSearchForm ? "max-h-[400px]" : "max-h-0"}
        `}
      >
        <InventorySearchForm onSearch={setSearchParams} />
      </div>
      {error && <p>{error}</p>}
      {loading ? <p>読み込み中...</p> : <InventoryTable data={data} onReceive={handleReceiveClick} />}
      {selectedItem && (
      <InventoryReceiveModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemCode={selectedItem.itemCode}
      />
    )}
    </main>
  );
}
