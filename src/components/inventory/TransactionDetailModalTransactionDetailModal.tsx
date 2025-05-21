"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/services/api";
import { PurchaseOrder, TransactionDetail } from "@/types/PurchaseOrder";

interface Props {
  transaction: TransactionDetail;
  onClose: () => void;
}

export default function TransactionDetailModal({
  transaction,
  onClose,
}: Props) {
  const [orderDetail, setOrderDetail] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    if (
      (transaction.transactionType === "PURCHASE_RECEIVE" ||
        transaction.transactionType === "ORDER_REGIST") &&
      transaction.purchaseOrder?.orderNo
    ) {
      api
        .get(`/order-history/${transaction.purchaseOrder.orderNo}`)
        .then((res) => {
          console.log("Fetched order detail:", res.data.data);
          setOrderDetail(res.data.data.content);
        })
        .catch((err) => {
          console.error("Failed to fetch order detail", err);
          setOrderDetail(null);
        });
    }
  }, [transaction]);

  const stock = transaction.stockItem;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#0d113d] opacity-40"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white w-full max-w-xl p-6 rounded-lg shadow-lg space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold">
          {stock.itemName}（{stock.itemCode}）
        </h2>
        <p className="text-sm text-gray-600">カテゴリ / 型番</p>
        <p className="text-sm text-gray-600">
          {stock.category} / {stock.modelNumber}
        </p>

        <div className="space-y-2">
          <p>
            処理種別:{" "}
            {transaction.transactionType === "MANUAL_RECEIVE"
              ? "手動入庫"
              : transaction.transactionType === "PURCHASE_RECEIVE"
              ? "発注入庫"
              : transaction.transactionType === "ORDER_REGIST"
              ? "発注登録"
              : "出庫"}
          </p>
          <p>
            数量:{" "}
            {transaction.transactionType === "MANUAL_DISPATCH"
              ? `-${transaction.quantity}`
              : transaction.transactionType === "ORDER_REGIST"
              ? `(${transaction.quantity})`
              : `+${transaction.quantity}`}
          </p>
        </div>

        {["PURCHASE_RECEIVE", "ORDER_REGIST"].includes(
          transaction.transactionType
        ) &&
          orderDetail && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold">発注情報</h3>
              <p>発注番号: {orderDetail.orderNo}</p>
              <p>発注日: {orderDetail.orderDate}</p>
              <p>仕入先: {orderDetail.supplier}</p>
              <p>送料: ￥{orderDetail.shippingFee}</p>
              <p>備考: {orderDetail.remarks || "-"}</p>
              <p className="font-medium mt-2">明細:</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {orderDetail.details?.map((d, i) => (
                  <li key={i}>
                    {d.itemCode} - {d.itemName}（￥{d.purchasePrice} ×{" "}
                    {d.quantity}）
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}
