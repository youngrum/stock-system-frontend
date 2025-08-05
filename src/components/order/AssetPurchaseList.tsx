import React, { useState } from "react";
import { SquareMinus ,SquarePlus, PackagePlus } from 'lucide-react';
import {
  PurchaseOrderResponse,
  PurchaseOrderDetailResponse,
} from "@/types/PurchaseOrder";

type Props = {
  orders: PurchaseOrderResponse[];
  onRegisterDelivery: (detail: PurchaseOrderDetailResponse) => void;
};

export default function AssetPurchaseList({ orders, onRegisterDelivery }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="rounded bg-white text-center">
      {/* ヘッダー */}
      <div className="grid grid-cols-18 font-semibold text-sm">
        <span className="col-span-1">発注番号</span>
        <span className="col-span-2">仕入れ先</span>
        <span className="col-span-1">小計</span>
        <span className="col-span-1">送料</span>
        <span className="col-span-1">値引</span>
        <span className="col-span-2 text-[12px]">トレーサビリティ証明書<br/>データ料(合算)</span>
        <span className="col-span-2 text-[12px]">校正証明書<br/>データ料(合算)</span>
        <span className="col-span-1">発注日</span>
        <span className="col-span-2">担当者</span>
        <span className="col-span-1">ステータス</span>
        <span className="col-span-3">備考</span>
        <span className="col-span-1">詳細</span>
      </div>
      {/* 一覧 */}
      {orders.map((order, idx) => (
        <div key={order.orderNo}>
          <div className="grid grid-cols-18 gap-y-4 items-center pt-2 hover:bg-gray-50 border-b text-[12px]"
          onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
          >
            <span className="col-span-1">{order.orderNo}</span>
            <span className="col-span-2">{order.supplier}</span>
            <span className="col-span-1">
              {order.orderSubtotal?.toLocaleString() || "0" }円
            </span>
            <span className="col-span-1">
              {order.shippingFee?.toLocaleString() || "0" }円
            </span>
            <span className="col-span-1">
              {order.discount?.toLocaleString() || "0"}円
            </span>
            <span className="col-span-2">
              {order.traceabilityCert?.toLocaleString() || "0"}円
            </span>
            <span className="col-span-2">
              {order.calibrationCert?.toLocaleString() || "0"}円
            </span>
            <span className="col-span-1">{order.orderDate}</span>
            <span className="col-span-2">{order.operator}</span>
            <span className={`
                px-3 py-1 rounded-full text-xs col-span-1
                ${order.status === "完了"
                  ? "bg-green-500 text-white"
                  : order.status === "未完了" || order.status === "未入庫"
                    ? "bg-lime-300 text-green-900"
                    : order.status === "一部入庫"
                      ? "bg-yellow-400 text-yellow-900"
                      : ""
                }
              `}>
                {order.status}
                </span>
            <span className="truncate col-span-3" title={order.remarks}>
              {order.remarks}
            </span>
            <span className="col-span-1">
              <button className={` transition-transform duration-300 ${expandedIndex === idx? "rotate-180" : "rotate-0"}`}>
                {expandedIndex === idx ? <SquareMinus /> : <SquarePlus />}
              </button>
            </span>

          {/* アコーディオン明細 */}
            <div className={`col-span-18 transition-all duration-500 ease-in-out overflow-hidden ${expandedIndex === idx ? "max-h-[400px]" : "max-h-0"}`}>
              <table className="w-full text-sm py-2">
                <thead>
                  <tr className="font-semibold bg-blue-50 text-sm">
                    <th className="py-1 col-span-3">品名</th>
                    <th className="py-1 col-span-3">管理番号</th>
                    <th className="py-1 col-span-3">製造番号</th>
                    <th className="py-1 col-span-2">型番・規格</th>
                    <th className="py-1 col-span-2">メーカー</th>
                    <th className="py-1 col-span-2">発注数</th>
                    <th className="py-1 col-span-2">受領数</th>
                    <th className="py-1 col-span-2">単価</th>
                    <th className="py-1 col-span-2">ステータス</th>
                    <th className="py-1 col-span-2">更新</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.details || []).map((detail, i) => (
                    <tr key={detail.id}
                      className={`${i % 2 === 0 ? 'bg-gray-50': 'bg-blue-50'} text-[12px]`}
                    >
                      <td className="py-2 truncate max-w-[150px] col-span-2">{detail.itemName}</td>
                      <td className="py-2 col-span-2">{detail.AssetCode || "-"}</td>
                      <td className="py-2 col-span-2">{detail.serialNumber || "-"}</td>
                      <td className="py-2 col-span-2">{detail.modelNumber || "-"}</td>
                      <td className="py-2 col-span-2">{detail.suplier || "-"}</td>
                      <td className="py-2 col-span-2">{detail.quantity}</td>
                      <td className="py-2 col-span-2">{detail.receivedQuantity}</td>
                      <td className="py-2 col-span-2">{detail.purchasePrice.toLocaleString()}円</td>
                      <td>
                      <span
                        className={`
                          px-5 py-1 rounded-full text-xs
                          ${detail.status === "完了"
                            ? "bg-green-500 text-white"
                            : detail.status === "未完了" || detail.status === "未入庫"
                              ? "bg-lime-300 text-green-900"
                              : detail.status === "一部入庫"
                                ? "bg-yellow-400 text-yellow-900"
                                : ""
                          }
                        `}
                      >{detail.status}</span>
                      </td>
                      <td className="py-2 col-span-2">
                        
                        <button
                          className={
                            "text-xs text-white rounded px-2 py-1 " +
                            (detail.status !== "完了" ? "hover:opacity-80 transition" : "")
                          }
                          onClick={(e) => {onRegisterDelivery(detail); e.stopPropagation();}}
                          
                          disabled={detail.status === "完了"}
                        >
                          <PackagePlus style={
                              detail.status === "完了"
                                ? { color: "#9CA3AF" }
                                : { color: "#0d113d" }
                            }/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
        </div>
      ))}
    </div>
  );
}
