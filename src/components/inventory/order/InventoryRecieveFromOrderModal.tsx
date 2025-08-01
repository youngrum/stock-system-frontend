import React, { useState, useEffect } from "react";
import { PurchaseOrderDetailResponse } from "@/types/PurchaseOrder";

type Props = {
  open: boolean;
  detail: PurchaseOrderDetailResponse;
  onClose: () => void;
  onSubmit: (
    detail: PurchaseOrderDetailResponse,
    receivedQuantity: number
  ) => void;
};

export default function InventoryRecieveFromOrderModal({
  open,
  detail,
  onClose,
  onSubmit,
}: Props) {
  const maxValue = detail.quantity - (detail.receivedQuantity ?? 0);
  const [quantity, setQuantity] = useState<number>(detail.quantity);

  useEffect(() => {
    setQuantity(maxValue);
  }, [maxValue]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded shadow-lg w-[340px]">
        <h3 className="font-bold mb-2">納品登録</h3>
        <div className="mb-4 text-sm space-y-1">
          <div>
            在庫ID: <span className="font-mono">{detail.itemCode}</span>
          </div>
          <div>品名: {detail.itemName}</div>
          <div>発注数: {detail.quantity}</div>
          <div>受領数: {detail.receivedQuantity}</div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-xs">納品数</label>
          <input
            type="number"
            value={quantity}
            min={1}
            max={maxValue}
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ border: "1px solid #9F9F9F" }}
          />
        </div>
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-1 rounded bg-gray-300">
            キャンセル
          </button>
          <button
            onClick={() => onSubmit(detail, quantity)}
            className="px-4 py-1 rounded bg-blue-600 text-white"
          >
            登録
          </button>
        </div>
      </div>
    </div>
  );
}
