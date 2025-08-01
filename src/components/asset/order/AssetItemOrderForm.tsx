// components/asset/order/AssetItemOrderForm.tsx
import React from "react";
import { AssetPurchaseOrderDetailRequest } from "@/types/PurchaseOrderDetail";
import { X } from "lucide-react";

type Props = {
  item: AssetPurchaseOrderDetailRequest;
  index: number;
  updateItem: (index: number, field: string, value: string | number) => void;
  removeItem: (index: number) => void;
};

// 新規設備用発注明細コンポーネント
export default function AssetItemOrderForm({
  item,
  index,
  updateItem,
  removeItem,
}: Props) {

  // const [itemState, setItemState ] = useState<AssetPurchaseOrderDetailFormState | null>(null);

  console.log(item);
  return (
    <div
      key={index}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
    >
      {/* 商品基本情報 - 上段 */}
      <div className="grid grid-cols-12 gap-3 mb-3">
        <div className="col-span-4 relative"> {/* col-span-5 から変更 */}
          <label
            className="block text-sm text-gray-600 mb-1 font-semibold"
            style={{ color: "#101540" }}
          >
            品名 *
          </label>
          <input
            type="text"
            value={item.itemName}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            onChange={(e) => updateItem(index, "itemName", e.target.value)}
            placeholder="商品名を入力"
            required
          />
        </div>

        <div className="col-span-4">
          <label
            className="block text-sm text-gray-600 mb-1 font-semibold"
            style={{ color: "#101540" }}
          >
            型番 *
          </label>
          <input
            type="text"
            value={item.modelNumber}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            onChange={(e) => updateItem(index, "modelNumber", e.target.value)}
            placeholder="ABC-123-XYZ"
            required
          />
        </div>

        <div className="col-span-3">
          <label
            className="block text-sm text-gray-600 mb-1 font-semibold"
            style={{ color: "#101540" }}
          >
            カテゴリー *
          </label>
          <input
            type="text"
            value={item.category}
            onChange={(e) => updateItem(index, "category", e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="電子部品"
            required
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

      {/* メーカー・数量・商品単価・校正単価・備考 - 下段 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-3">
          <label
            className="block text-sm text-gray-600 mb-1 font-semibold"
            style={{ color: "#101540" }}
          >
            メーカー{" "}
          </label>
          <input
            type="text"
            value={item.manufacturer}
            onChange={(e) => updateItem(index, "manufacturer", e.target.value)}
            placeholder="パナソニック"
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
        <div className="col-span-2">
          <label
            className="block text-sm text-gray-600 mb-1 font-semibold"
            style={{ color: "#101540" }}
          >
            数量 *
          </label>
          <input
            type="number"
            value={item.quantity}
            placeholder="10"
            min={1}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
            required
          />
        </div>

        <div className="col-span-2">
          <label
            className="block text-sm text-gray-600 mb-1 font-semibold"
            style={{ color: "#101540" }}
          >
            単価 *
          </label>
          <input
            type="number"
            value={item.purchasePrice}
            placeholder="300"
            min={1}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => updateItem(index, "purchasePrice", Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
            required
          />
        </div>
        {/* 校正単価を追加 */}
        <div className="col-span-2">
          <label
            className="block text-sm text-gray-600 mb-1 font-semibold"
            style={{ color: "#101540" }}
          >
            校正単価
          </label>
          <input
            type="number"
            value={item.calibrationPrice}
            placeholder="1000"
            min={0}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => updateItem(index, "calibrationPrice", Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
          />
        </div>


        <div className="col-span-3"> {/* col-span-6 から変更 */}
          <label
            className="block text-sm text-gray-600 mb-1 font-semibold"
            style={{ color: "#101540" }}
          >
            備考
          </label>
          <input
            type="text"
            value={item.remarks}
            onChange={(e) => updateItem(index, "remarks", e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="特記事項があれば入力"
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-2">
          <label
            className="block text-sm text-gray-600 mb-1 font-semibold"
            style={{ color: "#101540" }}
          >
            小計
          </label>
          <input
            type="text"
            value={(item.quantity * item.purchasePrice).toLocaleString()}
            className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
            readOnly
          />
        </div>
        {item.calibrationPrice > 0 && (
          <div className="col-span-2">
            <label
              className="block text-sm text-gray-600 mb-1 font-semibold"
              style={{ color: "#101540" }}
            >
              校正小計
            </label>
            <input
              type="text"
              value={(item.quantity * item.calibrationPrice).toLocaleString()}
              className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
}