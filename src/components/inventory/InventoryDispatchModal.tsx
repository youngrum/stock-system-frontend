'use client'

import { useEffect, useState } from 'react';
import { InventoryItem } from '@/types/InventoryItem'
import { X } from 'lucide-react';
import api from '@/services/api';

interface InventoryDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemCode: string;
  onSuccess: () => void;
}

export default function InventoryDispatchModal({ isOpen, onClose, itemCode, onSuccess }: InventoryDispatchModalProps) {
  const [inventory, setInventory] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && itemCode) {
      api.get(`/inventory/${itemCode}`)
        .then(res => setInventory(res.data.data))
        .catch(() => onClose());
    }
  }, [isOpen, itemCode, onClose]);

  const handleSubmit = async () => {
    if (!quantity || quantity <= 0) return;

    const confirmed = window.confirm(`本当にこの内容で出庫しますか？\n\n対象ID:${itemCode}\n\n数量: ${quantity}\n備考: ${remarks || 'なし'}`);
  
    if(!confirmed){
        window.confirm("処理を取り消しました");
        return;
      }

    setLoading(true);
    try {
      await api.post(`/inventory/dispatch/${itemCode}`, {
        itemCode,
        quantity,
        remarks: remarks || '-',
      });
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !inventory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#0d113d] opacity-40" onClick={onClose} />
      <div className="relative z-10 bg-white w-[800px] rounded shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{inventory.itemName}</h2>
          <p className="text-sm text-gray-600">{itemCode}</p>
          <p className="text-sm text-gray-600">{inventory.modelNumber}</p>
          <p>カテゴリ: {inventory.category}</p>
          <p>メーカー: {inventory.manufacturer}</p>
          <p>現在庫: {inventory.currentStock}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">数量</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">備考（任意）</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r text-white py-2 rounded hover:opacity-90"
            style={{
                background: "linear-gradient(to bottom, #5A00E0, #7040D0)",
              }}
            >
            {loading ? '出庫中...' : '出庫する'}
          </button>
        </div>
      </div>
    </div>
  );
}
