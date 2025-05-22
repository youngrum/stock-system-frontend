'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import TransactionTable from '@/components/inventory/TransactionTable';
import {Transaction} from '@/types/Transaction'
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

export default function TransactionPage() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useAuthGuard();
  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      console.log(res.data.data.content);
      setData(res.data.data.content); // APIのレスポンス形式により必要に応じて調整
    } catch (err) {
      console.error('トランザクション取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchTransactions();
  }, []);

  return (
    <main className="bg-white border-gray-400 p-3 shadow p-5">
        <div className="mb-4">
        <h2
          className="text-2xl font-bold text-gray-800 text-"
          style={{ color: "#101540" }}
        >
          入出庫一覧・検索
        </h2>
      {loading ? <p>読み込み中...</p> : <TransactionTable data={data} />}
      </div>
    </main>
  );
}
