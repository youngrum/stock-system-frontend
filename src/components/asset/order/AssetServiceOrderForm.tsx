// components/asset/order/AssetServiceOrderForm.tsx
import React from "react";
import { AssetPurchaseOrderDetailRequest } from "@/types/PurchaseOrderDetail";
import { X } from "lucide-react";

type Props = {
  item: AssetPurchaseOrderDetailRequest;
  index: number;
  updateItem: (index: number, field: string, value: string | number) => void;
  removeItem: (index: number) => void;
};

// 既存設備への修理・校正用発注明細コンポーネント
export default function AssetServiceOrderForm({
  item,
  index,
  updateItem,
  removeItem,
}: Props) {
  return (
    <div
      key={index}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
    >
      <div className="grid grid-cols-12 gap-3 mb-3">
        <div className="col-span-4">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            サービス種別 *
          </label>
          <select
            value={item.serviceType}
            onChange={(e) => updateItem(index, "serviceType", e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          >
            <option value="">選択してください</option>
            <option value="calibration">校正</option>
            <option value="repair">修理</option>
          </select>
        </div>
        <div className="col-span-4">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            品名 *
          </label>
          <input
            type="text"
            value={item.itemName}
            onChange={(e) => updateItem(index, "itemName", e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="校正/修理対象品名"
            required
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            型番
          </label>
          <input
            type="text"
            value={item.modelNumber}
            onChange={(e) => updateItem(index, "modelNumber", e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="型番 (任意)"
          />
        </div>
        <div className="col-span-1 flex items-end justify-center">
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
            title="この商品を削除"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-3">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            メーカー
          </label>
          <input
            type="text"
            value={item.manufacturer}
            onChange={(e) => updateItem(index, "manufacturer", e.target.value)}
            placeholder="メーカー (任意)"
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            費用 *
          </label>
          <input
            type="number"
            value={item.serviceCost}
            onChange={(e) => updateItem(index, "serviceCost", Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
            min={0}
            required
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            返却予定日
          </label>
          <input
            type="date"
            value={item.returnDate}
            onChange={(e) => updateItem(index, "returnDate", e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            備考
          </label>
          <input
            type="text"
            value={item.remarks}
            onChange={(e) => updateItem(index, "remarks", e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="特記事項"
          />
        </div>
      </div>
    </div>
  );
}