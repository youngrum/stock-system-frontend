import React, { useState } from "react";
import {
  PurchaseOrderResponse,
  PurchaseOrderDetailResponse,
} from "@/types/PurchaseOrder";

type Props = {
  orders: PurchaseOrderResponse[];
  onRegisterDelivery: (detail: PurchaseOrderDetailResponse) => void;
};

export default function PurchaseList({ orders, onRegisterDelivery }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="divide-y border rounded bg-white">
      {/* ヘッダー */}
      <div className="grid grid-cols-9 font-semibold p-2 bg-gray-100">
        <span>発注番号</span>
        <span>仕入れ先</span>
        <span>小計</span>
        <span>送料</span>
        <span>発注日</span>
        <span>担当者</span>
        <span>ステータス</span>
        <span>備考</span>
        <span></span>
      </div>
      {/* 一覧 */}
      {orders.map((order, idx) => (
        <React.Fragment key={order.orderNo}>
          <div className="grid grid-cols-9 items-center p-2 hover:bg-gray-50">
            <span>{order.orderNo}</span>
            <span>{order.supplier}</span>
            <span className="text-right">
              {order.orderSubtotal?.toLocaleString()}円
            </span>
            <span className="text-right">
              {order.shippingFee?.toLocaleString()}円
            </span>
            <span>{order.orderDate}</span>
            <span>{order.operator}</span>
            <span>{order.status}</span>
            <span className="truncate" title={order.remarks}>
              {order.remarks}
            </span>
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === idx ? null : idx)
              }
            >
              {expandedIndex === idx ? "－" : "＋"}
            </button>
          </div>
          {/* アコーディオン明細 */}
          {expandedIndex === idx && (
            <div className="bg-gray-50 p-2 rounded-b mb-2 col-span-9">
              <table className="w-full text-sm">
                <thead>
                  <tr className="font-semibold">
                    <th>商品ID</th>
                    <th>品名</th>
                    <th>型番</th>
                    <th>カテゴリ</th>
                    <th>数量</th>
                    <th>単価</th>
                    <th>ステータス</th>
                    <th>納品登録</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.details || []).map((detail) => (
                    <tr key={detail.itemCode}>
                      <td>{detail.itemCode}</td>
                      <td>{detail.itemName}</td>
                      <td>{detail.modelNumber}</td>
                      <td>{detail.category}</td>
                      <td className="text-right">{detail.quantity}</td>
                      <td className="text-right">{detail.purchasePrice}</td>
                      <td>{detail.status}</td>
                      <td>
                        <button
                          className="text-xs bg-blue-600 text-white rounded px-2 py-1 hover:bg-blue-700"
                          onClick={() => onRegisterDelivery(detail)}
                        >
                          納品登録
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
