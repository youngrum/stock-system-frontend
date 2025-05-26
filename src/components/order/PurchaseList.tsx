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
    <div className="rounded bg-white text-center">
      {/* ヘッダー */}
      <div className="grid grid-cols-18 font-semibold p-2">
        <span className="col-span-2">発注番号</span>
        <span className="col-span-2">仕入れ先</span>
        <span className="col-span-2">小計</span>
        <span className="col-span-2">送料</span>
        <span className="col-span-2">発注日</span>
        <span className="col-span-2">担当者</span>
        <span className="col-span-2">ステータス</span>
        <span className="col-span-3">備考</span>
        <span className="col-span-1">詳細</span>
      </div>
      {/* 一覧 */}
      {orders.map((order, idx) => (
        <React.Fragment key={order.orderNo}>
          <div className="grid grid-cols-18 items-center py-2 hover:bg-gray-50 border-b text-sm">
            <span className="col-span-2">{order.orderNo}</span>
            <span className="col-span-2">{order.supplier}</span>
            <span className="col-span-2">
              {order.orderSubtotal?.toLocaleString()}円
            </span>
            <span className="col-span-2">
              {order.shippingFee?.toLocaleString()}円
            </span>
            <span className="col-span-2">{order.orderDate}</span>
            <span className="col-span-2">{order.operator}</span>
            <span className="col-span-2">{order.status}</span>
            <span className="truncate col-span-3" title={order.remarks}>
              {order.remarks}
            </span>
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === idx ? null : idx)
              }
            >
              {expandedIndex === idx ? "－" : "＋"}
            </button>

          {/* アコーディオン明細 */}
          {expandedIndex === idx && (
            <div className="py-2 col-span-18">
              <table className="w-full text-sm ">
                <thead>
                  <tr className="font-semibold bg-blue-50">
                    <th className="py-1 col-span-3">商品ID</th>
                    <th className="py-1 col-span-3">品名</th>
                    <th className="py-1 col-span-2">型番</th>
                    <th className="py-1 col-span-2">カテゴリ</th>
                    <th className="py-1 col-span-2">数量</th>
                    <th className="py-1 col-span-2">単価</th>
                    <th className="py-1 col-span-2">ステータス</th>
                    <th className="py-1 col-span-2">納品登録</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.details || []).map((detail, i) => (
                    <tr key={detail.itemCode}
                      className={`${i % 2 === 0 ? 'bg-gray-50': 'bg-blue-50'}`}
                    >
                      <td className="py-1 col-span-2">{detail.itemCode}</td>
                      <td className="py-1 truncate max-w-[150px] col-span-2">{detail.itemName}</td>
                      <td className="py-1 col-span-2">{detail.modelNumber}</td>
                      <td className="py-1 col-span-2">{detail.category}</td>
                      <td className="py-1 col-span-2">{detail.quantity}</td>
                      <td className="py-1 col-span-2">{detail.purchasePrice}円</td>
                      <td className="py-1 col-span-2">{detail.status}</td>
                      <td className="py-1 col-span-2">
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
        </div>
        </React.Fragment>
      ))}
    </div>
  );
}
