// components/asset/order/AssetServiceOrderForm.tsx
import React, { useState, useEffect} from "react";
import api from "@/services/api";
import { AssetPurchaseOrderDetailFormState } from "@/types/PurchaseOrderDetail";
import { AssetItemResponse } from "@/types/AssetItem"
import { X } from "lucide-react";

type Props = {
  item: AssetPurchaseOrderDetailFormState;
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

  const [isLoading, setIsLoading] = useState(false);
  const [assetCodeError, setAssetCodeError] = useState<string>("");
  // API呼び出しの重複制御用
  const [lastFetchedCode, setLastFetchedCode] = useState<string>("");

 // assetCodeの変更を監視してAPI呼び出し
  useEffect(() => {
    console.log("item: "+ "%o",item);
    const currentCode: string = item.assetCode?.trim() || "";
    
    // 空か前回と同じコードの場合はスキップ
    if (!currentCode || currentCode === lastFetchedCode) {
      // 空の場合はフィールドをクリア
      if (!currentCode && lastFetchedCode) {
        setAssetCodeError("");
        setLastFetchedCode("");
        updateItem(index, "itemName", "");
        updateItem(index, "modelNumber", "");
        updateItem(index, "manufacturer", "");
        updateItem(index, "serialNumber", "");
        updateItem(index, "status", "");
        updateItem(index, "purchasePrice", "");
        updateItem(index, "relatedAssetId", "");
      }
      return;
    }

    const fetchAsset = async () => {
      setIsLoading(true);
      setAssetCodeError("");

      try {
        const res = await api.get(`/asset/${encodeURIComponent(currentCode)}`);
 
        // 型定義を統一
        const asset: AssetItemResponse = res.data.data;
        console.log("取得した設備情報:", asset);
        setLastFetchedCode(currentCode);
        
        // 取得したasset情報をフォームに反映
        updateItem(index, "itemName", asset.assetName || "");
        updateItem(index, "modelNumber", asset.modelNumber || "");
        updateItem(index, "manufacturer", asset.manufacturer || "");
        updateItem(index, "serialNumber", asset.serialNumber || "");
        updateItem(index, "category", asset.category || "");
        updateItem(index, "status", asset.status || "");
        updateItem(index, "relatedAssetId", asset.id || "");

      } catch (error) {
        console.error(error);
        const err = error.response.data as { response?: { data: ApiErrorResponse } };
        console.log(err)
        setAssetCodeError(error instanceof Error ? err.message : "設備情報の取得に失敗しました");
        setLastFetchedCode(currentCode);
        
        // エラー時は関連フィールドをクリア
        updateItem(index, "itemName", "");
        updateItem(index, "modelNumber", "");
        updateItem(index, "manufacturer", "");
        updateItem(index, "serialNumber", "");
        updateItem(index, "status", "");
        updateItem(index, "purchasePrice", "");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [item, index, updateItem, lastFetchedCode]);


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
            value={item.serviceType || ""}
            onChange={(e) => updateItem(index, "serviceType", e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          >
            <option value="">選択してください</option>
            <option value="CALIBRATION">校正</option>
            <option value="REPAIR">修理</option>
          </select>
        </div>
        <div className="col-span-4">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            管理番号 *
          </label>
          <div className="relative">
            <input
              type="text"
              value={item.assetCode || ""}
              onChange={(e) => updateItem(index, "assetCode", e.target.value)}
              className={`w-full bg-gray-50 border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                assetCodeError ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="設備管理番号を入力"
              required
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          {assetCodeError && (
            <p className="text-red-500 text-xs mt-1">{assetCodeError}</p>
          )}
        </div>
        <div className="col-span-4">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            品名
          </label>
          <input
            type="text"
            value={item.itemName || ""}
            className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-sm text-gray-600"
            placeholder="校正/修理対象品名"
            readOnly
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            型番
          </label>
          <input
            type="text"
            value={item.modelNumber || ""}
            className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-sm text-gray-600"
            readOnly
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
            value={item.manufacturer || ""}
            className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-sm text-gray-600"
            readOnly
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            費用 *
          </label>
          <input
            type="number"
             onChange={(e) => updateItem(index, "purchasePrice", e.target.value)}
            className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-sm text-gray-600 text-right"
            min={0}
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            製造番号
          </label>
          <input
            type="text"
            value={item.serialNumber || ""}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="特記事項"
            readOnly
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>
            ステータス
          </label>
          <input
            type="text"
            value={item.status || ""}
            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="特記事項"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}