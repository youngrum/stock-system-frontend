// components/asset/order/AssetOrderForm.tsx
"use client";

import { useState, useEffect } from "react";
import { AssetPurchaseOrderRequest } from "@/types/PurchaseOrder";
import { AssetPurchaseOrderDetailRequest, AssetPurchaseOrderDetailFormState} from "@/types/PurchaseOrderDetail";
import AssetOrderTabManagement from "./AssetOrderTabManagement";

type Props = {
  onSubmit: (formData: AssetPurchaseOrderRequest) => void;
  onReset: (resetFn: () => void) => void;
};

export default function AssetOrderForm({ onSubmit, onReset }: Props) {
  // 設備購入入力カード初期化
  const initialAssetItemState: AssetPurchaseOrderDetailFormState = {
      itemType: "ITEM",
      itemName: "",
      modelNumber: "",
      category: "",
      manufacturer: "",
      purchasePrice: 0,
      calibrationPrice: 0,
      quantity: 1,
      remarks: "",
  };

  // 校正・修理入力カード初期化
  const initialAssetServiceState: AssetPurchaseOrderDetailFormState = {
      itemType: "SERVICE",
      serviceType: undefined,
      relatedAssetId: undefined,
      purchasePrice: 0,
      remarks: "",
  };

  // ユニオンのうち AssetItemPurchaseOrderDetailFormState型
  const [newAssetItems, setNewAssetItems] = useState<AssetPurchaseOrderDetailFormState[]>([
    {
      itemType: "ITEM",
      itemName: "",
      modelNumber: "",
      category: "",
      manufacturer: "",
      purchasePrice: 0,
      calibrationPrice: 0,
      quantity: 1,
      remarks: ""
    },
  ]);

  // ユニオンのうち AssetServicePurchaseOrderDetailFormState型
  const [calibrationRepairItems, setCalibrationRepairItems] = useState<AssetPurchaseOrderDetailFormState[]>([
    {
      itemType: "SERVICE",
      serviceType: "",
      assetCode: undefined,
      purchasePrice: 0,
      remarks: ""
    }
  ]);

  // 共通入力情報
  const [supplier, setSupplier] = useState<string>("");
  const [orderDate, setOrderDate] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [calibrationCert, setCalibrationCert] = useState<number>(0); 
  const [traceabilityCert, setTraceabilityCert] = useState<number>(0); 
  const [remarks, setRemarks] = useState<string>("");

  // 現在のタブ (新規購入 / 校正・修理)
  const [currentOrderType, setCurrentOrderType] = useState<"newPurchase" | "calibrationRepair">("newPurchase");

  const addNewAssetItem = () => {
    setNewAssetItems([
      ...newAssetItems,
      { ...initialAssetItemState },
    ]);
  };

  const removeNewAssetItem = (index: number) => {
    setNewAssetItems(newAssetItems.filter((_, i) => i !== index));
  };

  const updateNewAssetItem = (index: number, field: string, value: string | number) => {
    setNewAssetItems((prevItems) => {
      const newItems = [...prevItems];
      const prevItem = prevItems[index];
      const newItem = {
        ...prevItem,
        [field]: value,
      };
      newItems[index] = newItem;
      return newItems;
    });
  };

  const addCalibrationRepairItem = () => {
    setCalibrationRepairItems([
      ...calibrationRepairItems,
      { ...initialAssetServiceState },
    ]);
  };

  const removeCalibrationRepairItem = (index: number) => {
    setCalibrationRepairItems(calibrationRepairItems.filter((_, i) => i !== index));
  };

  const updateCalibrationRepairItem = (index: number, field: string, value: string | number) => {
    setCalibrationRepairItems((prevItems) => {
      const newItems = [...prevItems];
      const prevItem = prevItems[index];
      const newItem = {
        ...prevItem,
        [field]: value,
      };
      newItems[index] = newItem;
      return newItems;
    });
  };

  const resetForm = () => {
    setNewAssetItems([initialAssetItemState]);
    setCalibrationRepairItems([]);
    setSupplier("");
    setOrderDate("");
    setShippingFee(0);
    setDiscount(0);
    setCalibrationCert(0);
    setTraceabilityCert(0);
    setRemarks("");
    setCurrentOrderType("newPurchase"); // フォームリセット時にタブも初期化
  };

  useEffect(() => {
    onReset(resetForm);
  }, [onReset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: AssetPurchaseOrderRequest = {
      supplier,
      orderDate,
      shippingFee,
      discount,
      calibrationCert,
      traceabilityCert,
      remarks,
      orderType: "ASSET", // 固定
      details: [],
    };

    if (currentOrderType === "newPurchase") {
      formData.details = newAssetItems.map((item) => {

        const requestItem: AssetItemPurchaseOrderDetailRequest = {
          itemType: item.itemType,
          serviceType: item.serviceType,
          itemName: item.itemName || "",
          manufacturer: item.manufacturer || "",
          modelNumber: item.modelNumber || "",
          category: item.category || "",
          purchasePrice: item.purchasePrice,
          quantity: item.quantity,
          remarks: item.remarks || "",
          services: [],
        };
        // calibrationPrice が入力されていれば CalibrationOrderRequest を生成して services に追加
        if (item.calibrationPrice && item.calibrationPrice > 0) {
          requestItem.services.push({
            itemName: `${item.itemName}の校正依頼`, //フォームで入力された itemName を元に生成
            serviceType: "CALIBRATION",
            purchasePrice: item.calibrationPrice,
            quantity: item.quantity, // 親アイテムの数量を使用
          });
        }
        return requestItem;
      });
    } else {
      formData.details = calibrationRepairItems.map((item) => {
        const requestItem: AssetPurchaseOrderDetailRequest = {
          serviceType: item.serviceType,
          itemType: item.itemType,
          itemName: `${item.serviceType === "CALIBRATION" ? "校正" : "修理"}依頼_${item.assetCode}`,
          modelNumber: item.modelNumber,
          manufacturer: item.manufacturer,
          purchasePrice: item.purchasePrice,
          quantity: 1,
          relatedAssetId: item.relatedAssetId,
          remarks: item.remarks,
        };
        return requestItem;
      });
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-6 space-y-6"
      style={{ color: "#101540" }}
    >
      <h2 className="text-2xl font-bold">設備品発注登録</h2>
      <h3 className="text-lg font-semibold mb-3">共通情報</h3>
      <div className="grid md:grid-cols-3 gap-x-4 gap-y-2 border-b pb-3 text-sm">
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">仕入先 *</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">発注日 *</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">送料 *</label>
          <input
            type="number"
            min={0}
            placeholder="1000"
            value={shippingFee}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => setShippingFee(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
            required
          />
        </div>
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">値引き</label>
          <input
            type="number"
            min={0}
            placeholder="1000"
            value={discount}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => setDiscount(Number(e.target.value))} 
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
          />
        </div>
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">校正証明書データ料(合算)</label>
          <input
            type="number"
            min={0}
            placeholder="1000"
            value={calibrationCert}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => setCalibrationCert(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
          />
        </div>
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">トレーサビリティ証明書データ料(合算)</label>
          <input
            type="number"
            min={0}
            placeholder="1000"
            value={traceabilityCert}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => setTraceabilityCert(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
          />
        </div>
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">備考</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="特記事項があれば入力"
          />
        </div>
      </div>

      <AssetOrderTabManagement
        newAssetItems={newAssetItems}
        calibrationRepairItems={calibrationRepairItems}
        onUpdateNewPurchaseItem={updateNewAssetItem}
        onRemoveNewPurchaseItem={removeNewAssetItem}  
        onAddNewPurchaseItem={addNewAssetItem}
        onUpdateCalibrationRepairItem={updateCalibrationRepairItem}
        onRemoveCalibrationRepairItem={removeCalibrationRepairItem}
        onAddCalibrationRepairItem={addCalibrationRepairItem}
        onOrderTypeChange={setCurrentOrderType}
        currentOrderType={currentOrderType}
      />
        
      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={resetForm} // キャンセルボタンでリセットを呼ぶ
          className="px-6 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-md text-white hover:opacity-90 transition-opacity"
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