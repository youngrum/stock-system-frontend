"use client";

import { useState } from "react";
import { PurchaseOrderRequest } from "@/types/PurchaseOrder";
import { X } from "lucide-react";

type Props = {
  onSubmit: (formData: PurchaseOrderRequest) => void;
};

export default function OrderForm({ onSubmit }: Props) {
  const [items, setItems] = useState([
    {
      itemCode: "",
      itemName: "",
      category: "",
      modelNumber: "",
      price: 0,
      quantity: 1,
      remarks: "",
    },
  ]);
  const [supplier, setSupplier] = useState("");
  const [orderDate, setOrderDate] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [remarks, setRemarks] = useState("");

  const addItem = () => {
    setItems([
      ...items,
      {
        itemCode: "",
        itemName: "",
        category: "",
        modelNumber: "",
        price: 0,
        quantity: 1,
        remarks: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: field === "quantity" || field === "price" || field === "shippingFee" ? Number(value) : value,
    };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: PurchaseOrderRequest = {
      supplier,
      shippingFee,
      orderDate,
      remarks,
      details: items.map((item) => ({
        itemCode: item.itemCode,
        itemName: item.itemName,
        category: item.category,
        modelNumber: item.modelNumber,
        price: item.price,
        quantity: item.quantity,
        remarks: item.remarks,
      })),
    };
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-6"
      style={{ color: "#101540" }}
    >
      <h2 className="text-2xl font-bold">発注登録</h2>
      <h3 className="text-lg font-semibold mb-3">共通情報</h3>

      <div className="grid md:grid-cols-3 gap-x-4 gap-y-2 border-b pb-3 text-sm">
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">仕入先</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">発注日</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">送料</label>
          <input
            type="number"
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
            required
          />
        </div>
        <div className="col-span-3">
          <label className="block mb-1 pb-2 pt-1 font-semibold">備考</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="使用案件・購入目的など"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">商品明細</h3>
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-20 gap-x-4 gap-y-1 pt-4 rounded-md bg-white mb-4"
          >
            {/* 上段 */}
            <div className="col-span-4">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>在庫ID</label>
              <input
                type="text"
                value={item.itemCode}
                onChange={(e) => updateItem(index, "itemCode", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <div className="col-span-9">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>品名</label>
              <input
                type="text"
                value={item.itemName}
                onChange={(e) => updateItem(index, "itemName", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <div className="col-span-6 row-span-2">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>備考</label>
              <textarea
                value={item.remarks}
                onChange={(e) => updateItem(index, "remarks", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition min-h-26"
              />
            </div>
            <div className="col-span-1 row-span-2 flex justify-center items-center">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                <X />
              </button>
            </div>

            {/* 下段 */}
            <div className="col-span-4">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>カテゴリー</label>
              <input
                type="text"
                value={item.category}
                onChange={(e) => updateItem(index, "category", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <div className="col-span-4">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>型番</label>
              <input
                type="text"
                value={item.modelNumber}
                onChange={(e) => updateItem(index, "modelNumber", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>数量</label>
              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>単価</label>
              <input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(index, "price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 text-blue-600 hover:underline"
        >
          ＋ 商品を追加
        </button>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 border rounded bg-blue-600 text-white hover:opacity-80"
          style={{
            background: "linear-gradient(to bottom, #3D00B8, #3070C3)",
          }}
        >
          登録する
        </button>
      </div>
    </form>
  );
}
