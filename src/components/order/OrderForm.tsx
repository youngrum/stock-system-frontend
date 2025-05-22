"use client";

import { useState } from "react";
import { PurchaseOrderRequest } from "@/types/PurchaseOrder";

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
  const [shippingFee, setShippingFee] = useState(0);
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
      [field]: field === "quantity" ? Number(value) : value,
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
      className="max-w-8xl mx-auto p-6 space-y-6"
      style={{ color: "#101540" }}
    >
      <h2 className="text-2xl font-bold">発注登録</h2>
      <h3 className="text-lg font-semibold mb-2">共通情報</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-3 text-sm">
        <div>
          <label className="block mb-1 pb-3 pt-1 font-semibold">仕入先</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block mb-1 pb-3 pt-1 font-semibold">発注日</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block mb-1 pb-3 pt-1 font-semibold">備考</label>
          <input
            type="date"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">商品明細</h3>
        <table className="w-full text-sm">
          <thead className="" style={{ color: "#101540" }}>
            <tr>
              <th className="pr-3 py-2 text-left">商品コード</th>
              <th className="px-3 py-2 text-left">品名</th>
              <th className="px-3 py-2 text-left">カテゴリー</th>
              <th className="px-3 py-2 text-left">型番</th>
              <th className="px-3 py-2 text-left">数量</th>
              <th className="px-3 py-2 text-left">単価</th>
              <th className="px-3 py-2 text-center">削除</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <>
                <tr key={index} className="bg-white">
                  <td className="pr-2 py-2">
                    <input
                      type="text"
                      value={item.itemCode}
                      onChange={(e) =>
                        updateItem(index, "itemCode", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      required
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) =>
                        updateItem(index, "itemName", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </td>
                  <td className="px-2 py-2 w-32">
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) =>
                        updateItem(index, "category", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-32"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={item.modelNumber}
                      onChange={(e) =>
                        updateItem(index, "modelNumber", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </td>
                  <td className="px-2 py-2 w-12">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-24"
                      min={1}
                      required
                    />
                  </td>
                  <td className="px-2 py-2 w-12">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-24"
                      min={1}
                      required
                    />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:underline"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
                <tr>
                  {/* 2段目：備考欄だけ横長で下段に */}
                  <td colSpan={6} className="pr-2 py-1">
                    <label
                      className="text-sm block mb-3
                      font-semibold"
                      style={{ color: "#101540" }}
                    >
                      備考
                    </label>
                    <input
                      placeholder="備考"
                      className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      value={item.remarks}
                      onChange={(e) =>
                        updateItem(index, "remarks", e.target.value)
                      }
                    />
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
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
          className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          登録する
        </button>
      </div>
    </form>
  );
}
