'use client'

import { useEffect, useState } from 'react';
import { RecieveItem } from '@/types/InventoryItem'
import { X } from 'lucide-react';
import api from "@/services/api";


interface InventoryReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemCode: string;
}

export default function InventoryReceiveModal({ isOpen, onClose, itemCode }: InventoryReceiveModalProps) {
  const [inventory, setInventory] = useState<RecieveItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [supplier, setSupplier] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [shoppingFee, setShoppingFee] = useState('');
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
        itemCode:inventory?.itemCode || null,
        quantity,
        supplier: inventory?.supplier || '不明',
        purchasePrice: inventory?.purchasePrice || 0,
        shoppingFee: inventory?.shoppingFee || 0,
        remarks: inventory?.remarks || '-',
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
      <div className="absolute inset-0 bg-[#0d113d] opacity-40" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 bg-white w-[800px] rounded shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-5 text-gray-500 hover:text-gray-800">
          <X className="text-[#0d113d]" />
        </button>

        {/* Left: Inventory Info */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{inventory.itemName}</h2>
          <p className="text-sm text-gray-600">{itemCode} </p>
          <p className="text-sm text-gray-600">{inventory.modelNumber}</p>
          <p className="text-[#0d113d]">カテゴリ: {inventory.category}</p>
          <p className="text-[#0d113d]">メーカー: {inventory.manufacturer}</p>
          <p className="text-[#0d113d]">現在庫: <span className="font-semibold">{inventory.currentStock}</span></p>
        </div>

        {/* Right: Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">数量</label>
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
            style={{ border: '1px solid #9F9F9F' }} />
          </div>
          <div>
            <label className="block text-sm font-medium">仕入先（任意）</label>
            <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
            style={{ border: '1px solid #9F9F9F' }} placeholder="ここに仕入先を入力"/>
          </div>
          <div>
            <label className="block text-sm font-medium">単価（任意）</label>
            <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
            style={{ border: '1px solid #9F9F9F' }} />
          </div>
          <div>
            <label className="block text-sm font-medium">送料（任意）</label>
            <input type="number" value={shoppingFee} onChange={e => setShoppingFee(e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
            style={{ border: '1px solid #9F9F9F' }} />
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full text-white py-2 rounded hover:opacity-90"
          style={{
            background: "linear-gradient(to bottom, #3D00B8, #3070C3)",
          }}>
            {loading ? '登録中...' : '入庫する'}
          </button>
        </div>
      </div>
    </div>
  );
}
