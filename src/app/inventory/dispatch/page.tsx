'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { InventoryItem } from '@/types/InventoryItem';

export default function InventoryDispatchPage() {
  const searchParams = useSearchParams();
  const itemCode = searchParams.get('itemCode');

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!itemCode) return;

    fetch(`/api/inventory/search/${itemCode}`)
      .then((res) => res.json())
      .then((data) => setItem(data.data))
      .catch(() => setError('商品情報の取得に失敗しました'));
  }, [itemCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!itemCode || quantity <= 0) {
      setError('数量は1以上で指定してください');
      return;
    }

    const res = await fetch('/api/inventory/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemCode, quantity, remarks }),
    });

    const result = await res.json();
    if (res.ok) {
      setMessage(`出庫完了: ${result.data.transactionId}`);
    } else {
      setError(result.message || '出庫に失敗しました');
    }
  };

  if (!item) return <p>読み込み中...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-lg font-bold mb-4">出庫登録</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">商品コード</label>
          <input type="text" value={item.itemCode} readOnly className="w-full border p-2 bg-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium">品名</label>
          <input type="text" value={item.itemName} readOnly className="w-full border p-2 bg-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium">型番</label>
          <input type="text" value={item.modelNumber} readOnly className="w-full border p-2 bg-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium">カテゴリ</label>
          <input type="text" value={item.category} readOnly className="w-full border p-2 bg-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium">出庫数</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">備考（任意）</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border p-2"
          />
        </div>

        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          出庫する
        </button>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
