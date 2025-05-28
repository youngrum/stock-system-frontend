"use client";

import { useEffect, useState } from "react";
import { InventoryItem } from "@/types/InventoryItem";
import { X } from "lucide-react";
import api from "@/services/api";
import Loader from "@/components/ui/Loader";

interface InventoryReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemCode: string;
}

export default function InventoryReceiveModal({
  isOpen,
  onClose,
  onSuccess,
  itemCode,
}: InventoryReceiveModalProps) {
  const [inventory, setInventory] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [supplier, setSupplier] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

    // ✅ 最終確認ダイアログの追加
    const confirmed = window.confirm(
      `本当にこの内容で入庫しますか？\n在庫ID:${itemCode}\n品名：${inventory.itemName}\nカテゴリー：${inventory.category}\n仕入先: ${
        supplier || "未入力"
      }\n↓\n数量: ${quantity}\n単価: ${purchasePrice || "未入力"}\n送料: ${
        shippingFee || "未入力"
      }\n備考: ${remarks || "なし"}`
    );

    if (!confirmed) {
      window.confirm("処理を取り消しました");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await api.post(`/inventory/receive/${itemCode}`, {
        itemCode: inventory?.itemCode || null,
        quantity: quantity,
        supplier: supplier || "不明",
        purchasePrice: purchasePrice || 0,
        shippingFee: shippingFee || 0,
        remarks: remarks || "-",
      });

      const response = res.data;
      console.log(response);
      alert(`入庫登録に成功しました（実行処理id: ${response.transactionId}）`);
      onClose();
      onSuccess();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !inventory) return null;

  return (
    <>
    {loading && <Loader />}
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#0d113d] opacity-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 bg-white w-[800px] rounded shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800"
        >
          <X className="text-[#0d113d]" />
        </button>

        {/* Left: Inventory Info */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{inventory.itemName}</h2>
          <p className="text-sm text-gray-600">{inventory.itemCode} </p>
          <p className="text-sm text-gray-600">{inventory.modelNumber}</p>
          <p className="text-[#0d113d]">カテゴリ: {inventory.category}</p>
          <p className="text-[#0d113d]">メーカー: {inventory.manufacturer}</p>
          <p className="text-[#0d113d]">
            現在庫:{" "}
            <span className="font-semibold">{inventory.currentStock}</span>
          </p>
        </div>

        {/* Right: Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">数量</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
              style={{ border: "1px solid #9F9F9F" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">仕入先（任意）</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
              style={{ border: "1px solid #9F9F9F" }}
              placeholder="ここに仕入先を入力"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">単価（任意）</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                style={{ border: "1px solid #9F9F9F" }}
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">送料（任意）</label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                style={{ border: "1px solid #9F9F9F" }}
                placeholder="1000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">備考（任意）</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
              rows={2}
              style={{ border: "1px solid #9F9F9F" }}
              placeholder="716・717案件"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white py-2 rounded hover:opacity-90"
            style={{
              background: "linear-gradient(to bottom, #3D00B8, #3070C3)",
            }}
          >
            {loading ? "登録中..." : "入庫する"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
