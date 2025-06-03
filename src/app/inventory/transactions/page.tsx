'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import TransactionTable from '@/components/inventory/TransactionTable';
import {Transaction} from '@/types/Transaction'
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import Pagination from "@/components/ui/Pagination";
import { ApiErrorResponse } from "@/types/ApiResponse";

export default function TransactionPage() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useAuthGuard();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions',{
          params: {
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
    <div className="bg-white border-gray-400 p-3 shadow p-5">
        <div className="mb-4">
        <h2
          className="text-2xl font-bold text-gray-800"
          style={{ color: "#101540" }}
        >
          入出庫処理一覧・検索
        </h2>
        {loading ? <p>読み込み中...</p> : <TransactionTable data={data} />}
        </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
