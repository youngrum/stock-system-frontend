'use client'

import { useEffect, useState } from 'react';
import api from "@/services/api";
import { X } from 'lucide-react';

interface InventoryReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemCode: string;
}

interface InventoryData {
  itemName: string;
  modelNumber: string;
  category: string;
  manufacturer: string;
  currentStock: number;
}

export default function InventoryReceiveModal({ isOpen, onClose, itemCode }: InventoryReceiveModalProps) {
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [supplier, setSupplier] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
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
    setLoading(true);
    try {
      await api.post(`/inventory/receive/${itemCode}`, {
        quantity,
        supplier: supplier || '-',
        purchasePrice: purchasePrice || 0,
        remarks: '-',
        manufacturer: inventory?.manufacturer || '-',
        orderNo: null,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !inventory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 bg-white w-[800px] rounded shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>

        {/* Left: Inventory Info */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{inventory.itemName}</h2>
          <p className="text-sm text-gray-600">{itemCode} ・ {inventory.modelNumber}</p>
          <p>カテゴリ: {inventory.category}</p>
          <p>メーカー: {inventory.manufacturer}</p>
          <p>現在庫: {inventory.currentStock}</p>
        </div>

        {/* Right: Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">数量</label>
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">仕入先（任意）</label>
            <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">単価（任意）</label>
            <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {loading ? '登録中...' : '入庫する'}
          </button>
        </div>
      </div>
    </div>
  );
}
