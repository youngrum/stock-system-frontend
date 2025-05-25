// app/order/order-list/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import PurchaseList from "@/components/order/PurchaseList";
import RecieveFromOrderModal from "@/components/order/RecieveFromOrderModal";
import {
  PurchaseOrderResponse,
  PurchaseOrderDetailResponse,
} from "@/types/PurchaseOrder";

export default function OrderHistoryPage() {
  const [selectedDetail, setSelectedDetail] =
    useState<PurchaseOrderDetailResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<PurchaseOrderResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // 履歴データ取得
  useEffect(() => {
    const fetchPurchaseList = async () => {
      try {
        const res = await api.get("/order-history", {
          params: {
            page, // ← 0始まり
            size: 10, // ← 1ページあたりの件数
          },
        });
        console.log(res.data);
        setData(res.data.content); // APIのレスポンス形式により必要に応じて調整
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("発注履歴取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseList();
  }, []);

  // モーダルの開閉制御
  const openModal = (detail: PurchaseOrderDetailResponse) => {
    setSelectedDetail(detail);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // 納品登録実行
  const handleRegisterDelivery = async (
    item: PurchaseOrderDetailResponse,
    quantity: number
  ) => {
    await api.post("/v1/api/receive-from-order", {
      orderNo: item.orderNo,
      itemCode: item.itemCode,
      receivedQuantity: quantity,
    });
    // 成功後、履歴を再取得するなど
    closeModal();
    // ここで再フェッチもしくはローカル更新
  };

  return (
    <main className="p-8">
      <h2 className="text-xl font-bold mb-4">発注履歴一覧</h2>
      <PurchaseList orders={data} onRegisterDelivery={openModal} />
      {selectedDetail && (
        <RecieveFromOrderModal
          open={modalOpen}
          detail={selectedDetail}
          onClose={closeModal}
          onSubmit={handleRegisterDelivery}
        />
      )}
    </main>
  );
}
