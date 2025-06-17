"use client";

import { useEffect, useState } from "react";
import { InventoryItem } from "@/types/InventoryItem";
import { X } from "lucide-react";
import api from "@/services/api";
import Loader from "@/components/ui/Loader";
import { ApiErrorResponse } from "@/types/ApiResponse";

interface InventoryDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemCode: string;
  onSuccess: () => void;
}

export default function InventoryDispatchModal({
  isOpen,
  onClose,
  onSuccess,
  itemCode,
}: InventoryDispatchModalProps) {
  const [inventory, setInventory] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState<number>("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && itemCode) {
      api
        .get(`/inventory/${itemCode}`)
        .then((res) => setInventory(res.data.data))
        .catch(() => onClose());
    }
  }, [isOpen, itemCode, onClose]);

  const handleSubmit = async () => {
    if (!quantity || quantity <= 0) return;
    if(inventory.currentStock < quantity) {
      alert(`出庫可能な数量は現在の在庫数(${inventory.currentStock})以下である必要があります。`);
      return;
    }

    const confirmed = window.confirm(
      `この内容で出庫しますか？\n在庫ID:${itemCode}\n品名：${inventory?.itemName}\nカテゴリー：${inventory?.category}\n数量: ${quantity}\n備考: ${
      remarks || "なし"
      }`
    );

    if (!confirmed) {
      window.confirm("処理を取り消しました");
      return;
    }

    setLoading(true);
    try {
      console.log("%o", inventory);
      const res = await api.post(`/inventory/dispatch/${itemCode}`, {
        itemCode: inventory?.itemCode || null,
        quantity: quantity,
        remarks: remarks,
      });
      onClose();
      onSuccess();
      const response = res.data.data;
      console.log(response);
      alert(`出庫登録に成功しました（実行処理id: ${response.transactionId}）`);
    } catch (error) {
      const err = error as { response?: { data: ApiErrorResponse } }
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        alert(`エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${error.error}\n・massage: ${error.message}\n・status: ${error.status}`); // エラーメッセージを利用
      }else {console.log(err)}
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !inventory) return null;

  return (
    <>
    {loading && <Loader />}
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#0d113d] opacity-40"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white w-[800px] rounded shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="text-[#0d113d]" />
        </button>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{inventory.itemName}</h2>
          <p className="text-sm text-gray-600">{itemCode}</p>
          <p className="text-sm text-gray-600">{inventory.modelNumber}</p>
          <p>カテゴリ: {inventory.category}</p>
          <p>メーカー: {inventory.manufacturer}</p>
          <p>
            現在庫: 
            <span className={inventory.currentStock == 0 ? "text-red-700" : ""}>
              {inventory.currentStock}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">数量</label>
            <input
              type="number"
              min={1}
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
              style={{ border: "1px solid #9F9F9F" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">備考（任意）</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
              rows={3}
              style={{ border: "1px solid #9F9F9F" }}
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
            {loading ? "出庫中..." : "出庫する"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
