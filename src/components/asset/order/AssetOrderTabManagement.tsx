// components/asset/order/AssetOrderTabManagement.tsx
import AssetItemOrderForm from "@/components/asset/order/AssetItemOrderForm";
import AssetServiceOrderForm from "@/components/asset/order/AssetServiceOrderForm";
import { AssetPurchaseOrderDetailRequest } from "@/types/PurchaseOrderDetail";

type Props = {
  // 親コンポーネント (AssetOrderForm) から渡される props
  newPurchaseItems: AssetPurchaseOrderDetailRequest[];
  calibrationRepairItems: AssetPurchaseOrderDetailRequest[];
  onUpdateNewPurchaseItem: (index: number, field: string, value: string | number) => void;
  onRemoveNewPurchaseItem: (index: number) => void;
  onAddNewPurchaseItem: () => void;
  onUpdateCalibrationRepairItem: (index: number, field: string, value: string | number) => void;
  onRemoveCalibrationRepairItem: (index: number) => void;
  onAddCalibrationRepairItem: () => void;
  onOrderTypeChange: (type: "newPurchase" | "calibrationRepair") => void;
  currentOrderType: "newPurchase" | "calibrationRepair";
};

export default function AssetOrderTabManagement({
  newAssetItems,
  calibrationRepairItems,
  onUpdateNewPurchaseItem,
  onRemoveNewPurchaseItem,
  onAddNewPurchaseItem,
  onUpdateCalibrationRepairItem,
  onRemoveCalibrationRepairItem,
  onAddCalibrationRepairItem,
  onOrderTypeChange,
  currentOrderType,
}: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">商品明細</h3>
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={() => onOrderTypeChange("newPurchase")}
          className={`px-4 py-2 rounded-md ${
            currentOrderType === "newPurchase"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } transition-colors`}
        >
          新規購入
        </button>
        <button
          type="button"
          onClick={() => onOrderTypeChange("calibrationRepair")}
          className={`px-4 py-2 rounded-md ${
            currentOrderType === "calibrationRepair"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } transition-colors`}
        >
          校正・修理
        </button>
      </div>

      {currentOrderType === "newPurchase" && (
        <>
          {newAssetItems.map((item, index) => (
            <AssetItemOrderForm
              key={index}
              item={item}
              index={index}
              updateItem={onUpdateNewPurchaseItem}
              removeItem={onRemoveNewPurchaseItem}
            />
          ))}
          <button
            type="button"
            onClick={onAddNewPurchaseItem}
            className="mt-4 px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            商品を追加
          </button>
        </>
      )}

      {currentOrderType === "calibrationRepair" && (
        <>
          {calibrationRepairItems.map((item, index) => (
            <AssetServiceOrderForm
              key={index}
              item={item}
              index={index}
              updateItem={onUpdateCalibrationRepairItem}
              removeItem={onRemoveCalibrationRepairItem}
            />
          ))}
          <button
            type="button"
            onClick={onAddCalibrationRepairItem}
            className="mt-4 px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            校正・修理品目を追加
          </button>
        </>
      )}
    </div>
  );
}