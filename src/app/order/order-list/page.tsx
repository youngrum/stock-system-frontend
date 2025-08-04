// app/order/order-list/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import InventoryPurchaseList from "@/components/order/InventoryPurchaseList";
import AssetPurchaseList from "@/components/order/AssetPurchaseList";
import PurchaseOrderTypeTab from "@/components/order/PurchaseOrderTypeTab";
import InventoryRecieveFromOrderModal from "@/components/inventory/order/InventoryRecieveFromOrderModal";
import Pagination from "@/components/ui/Pagination";
import {
  PurchaseOrderResponse,
  PurchaseOrderDetailResponse,
} from "@/types/PurchaseOrder";
import { ApiErrorResponse } from "@/types/ApiResponse";
import Loader from "@/components/ui/Loader";


type OrderType = "ASSET" | "INVENTTRY";

export default function OrderHistoryPage() {
  const [selectedDetail, setSelectedDetail] =
    useState<PurchaseOrderDetailResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [assetOrders, setAssetOrders] = useState<PurchaseOrderResponse[]>([]);
  const [inventryOrders, setInventryOrders] = useState<PurchaseOrderResponse[]>([]);
  const [assetPage, setAssetPage] = useState(0);
  const [inventryPage, setInventryPage] = useState(0);
  const [assetTotalPages, setAssetTotalPages] = useState(0);
  const [inventryTotalPages, setInventryTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderType>("ASSET");

  // 履歴データ取得
  const fetchPurchaseList = useCallback(async () => {
    try {
      const res = await api.get("/order-history", {
        params: {
          page: page,
          orderType: type
        },
      });
      console.log(res.data.content)
      if (type === "ASSET") {
        setAssetOrders(res.data.content);
        setAssetTotalPages(res.data.totalPages);
      } else {
        setInventryOrders(res.data.content);
        setInventryTotalPages(res.data.totalPages);
      }
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
  },[]);

  // activeTabとpageが変更されたときにデータを再取得
    useEffect(() => {
      if (activeTab === "ASSET") {
        fetchPurchaseList("ASSET", assetPage);
      } else {
        fetchPurchaseList("INVENT", inventryPage);
      }
    }, [fetchPurchaseList, activeTab, assetPage, inventryPage]);

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

  const handlePageChange = (newPage: number) => {
    if (activeTab === "ASSET") {
      setAssetPage(newPage);
    } else {
      setInventryPage(newPage);
    }
  };

  const tabs = [
    { label: "在庫品", value: "INVENT" },
    { label: "設備品(校正・修理)", value: "ASSET" },
  ];

  return (
    <>
    {loading && <Loader />}
    <main className="bg-white border-gray-400 shadow p-5">
      <h2 className="text-xl font-bold mb-4">発注履歴一覧</h2>
        <PurchaseOrderTypeTab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "ASSET" && (
          <AssetPurchaseList orders={assetOrders} onRegisterDelivery={openModal} />
        )}
        {activeTab === "INVENT" && (
          <InventoryPurchaseList orders={inventryOrders} onRegisterDelivery={openModal} />
        )}
        
        {/* activeTabに応じてモーダルを出し分け */}
        {selectedDetail && activeTab === "INVENT" && (
          <InventoryRecieveFromOrderModal
            open={modalOpen}
            detail={selectedDetail}
            onClose={closeModal}
            onSubmit={handleRegisterDelivery}
          />
        )}
        {/* {selectedDetail && activeTab === "ASSET" && (
          <AssetRecieveFromOrderModal
            open={modalOpen}
            detail={selectedDetail}
            onClose={closeModal}
            onSubmit={handleRegisterDelivery}
          />
        )} */}
        <Pagination
          currentPage={activeTab === "ASSET" ? assetPage : inventryPage}
          totalPages={activeTab === "ASSET" ? assetTotalPages : inventryTotalPages}
          onPageChange={handlePageChange}
        />
    </main>
    </>
  );
}
