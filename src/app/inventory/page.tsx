// inventory/page.tsx
"use client";

import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryReceiveModal from "@/components/inventory/InventoryReceiveModal";
import InventoryDispatchModal from "@/components/inventory/InventoryDispatchModal";
import InventorySearchForm from "@/components/inventory/InventorySearchForm";
import Pagination from "@/components/ui/Pagination";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { InventoryItem } from "@/types/InventoryItem";
import { InventorySearchParams } from "@/types/InventoryItem";
import { useEffect, useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

import api from "@/services/api";
import { ApiErrorResponse } from "@/types/ApiResponse";

export default function InventoryListsPage() {
  const router = useRouter();
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
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isRecieveModalOpen, setIsRecieveModalOpen] = useState(false);
  const handleReceiveClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsRecieveModalOpen(true);
  };
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const handleDispatchClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDispatchModalOpen(true);
  };
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/inventory/search", {
        params: {
          ...searchParams, // itemCode, itemName を展開
          page: page,
        },
      });
      console.log(res.data.data.content);
      setData(res.data.data.content); // ← ここがAPIのレスポンスに依存する（必要に応じて .data.content）
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data: ApiErrorResponse } };
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        alert(
          `エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${error.error}\n・massage: ${error.message}\n・status: ${error.status}`
        ); // エラーメッセージを利用
      }
      setError("在庫データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [searchParams, page]);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchData();
  }, [fetchData, isLoggedIn]);

  return (
    <main className="bg-white border-gray-400 shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-2xl font-bold text-gray-800 text-"
          style={{ color: "#101540" }}
        >
          在庫一覧・検索
        </h2>
        {/* 右側：検索ボタン＋在庫追加ボタン */}
        <div className="flex items-center space-x-3">
          {/* 🔍 検索マーク */}
          <button
            onClick={toggleSearchForm}
            className={`text-[#101540] hover:text-indigo-600 text-xl focus:outline-none transition-transform duration-300 ${
              showSearchForm ? "rotate-180" : "rotate-0"
            }`}
            aria-label="検索フォーム切り替え"
          >
            {showSearchForm ? (
              <X className="text-[#0d113d]" width={30} height={30} />
            ) : (
              <Search className="text-[#0d113d]" width={30} height={30} />
            )}
          </button>

          {/* csvuploadフォームリンク */}
          <button className="px-5 py-3 border rounded p-2 hover:bg-[#1d1f3c] hover:text-gray-200 text-xl" onClick={() => router.push("/csv")}>
            import with csv
          </button>
          
          {/* 新規登録ボタン */}
          <button
            className="px-5 py-3 text-xl font-medium text-white rounded shadow-md hover:opacity-90"
            style={{
              background: "linear-gradient(to bottom, #3D00B8, #3070C3)",
            }}
            onClick={() => router.push("/inventory/new")}
          >
            ＋ 新規在庫登録
          </button>
        </div>
      </div>
      <div
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${showSearchForm ? "max-h-[400px]" : "max-h-0"}
        `}
      >
        <InventorySearchForm onSearch={setSearchParams} />
      </div>

      {error && <p>{error}</p>}
      {loading ? (
        <Loader />
      ) : (
        <InventoryTable
          data={data}
          onReceive={handleReceiveClick}
          onDispach={handleDispatchClick}
        />
      )}
      {selectedItem && (
        <>
          <InventoryReceiveModal
            isOpen={isRecieveModalOpen}
            onClose={() => setIsRecieveModalOpen(false)}
            itemCode={selectedItem.itemCode}
            onSuccess={fetchData}
          />
          <InventoryDispatchModal
            isOpen={isDispatchModalOpen}
            onClose={() => setIsDispatchModalOpen(false)}
            itemCode={selectedItem.itemCode}
            onSuccess={fetchData}
          />
        </>
      )}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </main>
  );
}
