// app/order/order-list/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import PurchaseList from "@/components/inventory/order/InventoryPurchaseList";
import RecieveFromOrderModal from "@/components/inventory/order/InventoryRecieveFromOrderModal";
import Pagination from "@/components/ui/Pagination";
import {
  PurchaseOrderResponse,
  PurchaseOrderDetailResponse,
} from "@/types/PurchaseOrder";
import { ApiErrorResponse } from "@/types/ApiResponse";
import Loader from "@/components/ui/Loader";

export default function OrderHistoryPage() {
  const [selectedDetail, setSelectedDetail] =
    useState<PurchaseOrderDetailResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<PurchaseOrderResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // 履歴データ取得
  const fetchPurchaseList = useCallback(async () => {
    try {
      const res = await api.get("/order-history", {
        params: {
          page: page,
        },
      });
      console.log(res.data.content)
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data: ApiErrorResponse } }
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        alert(`エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${error.error}\n・massage: ${error.message}\n・status: ${error.status}`); // エラーメッセージを利用
        console.error("発注履歴取得エラー:", err);
      }
    } finally {
      setLoading(false);
    }
  },[page]);
  
  useEffect(() => {
    fetchPurchaseList();
  }, [fetchPurchaseList, page]);

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
    console.log("%o", item);
    try {
    const res = await api.post("/receive-from-order", {
      orderNo: item.orderNo, // itemに含まれていない
      items: [{ itemCode: item.itemCode, receivedQuantity: quantity}]
    });
    console.log("納品登録成功:", res.data);
    // 成功時の処理
    alert("納品登録が完了しました。");

    // 成功後、履歴を再取得するなど
    closeModal();
    // ここで再フェッチもしくはローカル更新
    fetchPurchaseList();
    } catch (error) {
      console.error("納品登録エラー:", error);
      const err = error as { response?: { data: ApiErrorResponse } }
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        alert(`エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${error.error}\n・massage: ${error.message}\n・status: ${error.status}`); // エラーメッセージを利用
      }
    }
  };

  return (
    <>
    {loading && <Loader />}
    <main className="bg-white border-gray-400 shadow p-5">
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
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </main>
    </>
  );
}
