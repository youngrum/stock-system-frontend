// inventory/page.tsx
"use client";

import AssetTable from "@/components/asset/AssetTable";
import AssetUpdateModal from "@/components/asset/AssetUpdateModal";
import AssetSearchForm from "@/components/asset/AssetSearchForm";
import Pagination from "@/components/ui/Pagination";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useEffect, useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

import api from "@/services/api";
import { ApiErrorResponse } from "@/types/ApiResponse";

export default function InventoryListsPage() {
  const router = useRouter();
  const isLoggedIn = useAuthGuard();
  const [data, setData] = useState<AssetIetmResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const toggleSearchForm = () => setShowSearchForm((prev) => !prev);
  const [searchParams, setSearchParams] = useState<AssetSearchParams>({
    assetCode: "",
    assetName: "",
    category: "",
    modelNumber: "",
    nextCalibrationDate: "",
  });
  const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const handleUpdateClick = (item: AssetItem) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  };

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/asset/search", {
        params: {
          ...searchParams, // assetCode, assetName を展開
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
      }else {
        alert("在庫情報の取得に失敗しました。");
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams, page]);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchData();
  }, [fetchData, isLoggedIn]);

  return (
    <main className="bg-white border-gray-400 shadow p-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-2xl font-bold text-gray-800"
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
            onClick={() => router.push("/Asset/new")}
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
        <AssetSearchForm onSearch={setSearchParams} />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <AssetTable
          data={data}
          onUpdate={handleUpdateClick}
        />
      )}
      {selectedItem && (
        <>
          <AssetUpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
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
