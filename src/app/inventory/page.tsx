// inventory/page.tsx
'use client'

import InventoryTable from '@/components/inventory/InventoryTable'
import { mockInventoryData } from '@/data/inventoryMock'
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { InventoryItem } from '@/types/InventoryItem';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function InventoryListsPage() {
  const isLoggedIn = useAuthGuard();
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      try {
        const res = await api.get('/inventory/search');
        console.log();
        console.log(res.data.data.content);
        setData(res.data.data.content); // ← ここがAPIのレスポンスに依存する（必要に応じて .data.content）
      } catch (err) {
        console.log(err);
        setError('在庫データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);


  return (
    <main className="bg-white border-gray-400 p-3 shadow mt-20">
      <h2 className="text-lg font-bold text-gray-800" style={{ color: '#101540' }}>在庫一覧・検索</h2>
      {/* <InventorySearchForm /> */}
      <InventoryTable data={data} />
    </main>
  )
}
