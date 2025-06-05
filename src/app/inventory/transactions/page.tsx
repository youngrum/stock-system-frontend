'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import TransactionTable from '@/components/inventory/TransactionTable';
import {Transaction, TransactionSearchParams} from '@/types/Transaction'
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import Pagination from "@/components/ui/Pagination";
import { ApiErrorResponse } from "@/types/ApiResponse";
import { Search, X } from "lucide-react";
import TransactionSearchForm from '@/components/inventory/TransactionSearchForm';

export default function TransactionPage() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useAuthGuard();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const toggleSearchForm = () => setShowSearchForm((prev) => !prev);
  const [searchParams, setSearchParams] = useState<TransactionSearchParams>({
    itemCode: "",
    operator: "",
    fromDate: "",
    toDate: "",
  });

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions',{
          params: {
            ...searchParams, // itemCode, operator, fromDate, toDate を展開
            page,  // ← 0始まり
            size: 10  // ← 1ページあたりの件数
          }});
      console.log(res.data.data.content);
      setData(res.data.data.content); // APIのレスポンス形式により必要に応じて調整
      console.log(res.data.data.totalPages);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.error('トランザクション取得エラー:', error);
      const err = error as { response?: { data: ApiErrorResponse } }
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        alert(`エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${error.error}\n・massage: ${error.message}\n・status: ${error.status}`); // エラーメッセージを利用
      }
      console.error('トランザクション取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchTransactions();
  }, [page]);

  return (
    <main className="bg-white border-gray-400 shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-2xl font-bold text-gray-800"
          style={{ color: "#101540" }}
        >
          入出庫処理一覧・検索
        </h2>
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
        </div>
        </div>
        <div
          className={`
            transition-all duration-500 ease-in-out overflow-hidden
            ${showSearchForm ? "max-h-[400px]" : "max-h-0"}
          `}
          ><TransactionSearchForm onSearch={setSearchParams} /></div>
        
          {loading ? <p>読み込み中...</p> : <TransactionTable data={data} />}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </main>
    );
}
