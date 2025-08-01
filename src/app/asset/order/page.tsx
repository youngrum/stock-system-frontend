// app/order/new/page.tsx
"use client";

import AssetOrderForm from "@/components/asset/order/AssetOrderForm";
import { AssetPurchaseOrderRequest } from "@/types/PurchaseOrder";
import api from "@/services/api";
import { useState, useRef } from "react";
import Loader from "@/components/ui/Loader";
import { ApiErrorResponse } from "@/types/ApiResponse";

export default function OrderNewPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const resetFormRef = useRef<(() => void) | null>(null);

  const handleFormReset = (resetFn: () => void) => {
    resetFormRef.current = resetFn;
  };

  const handleOrderSubmit = async (
    formData: AssetPurchaseOrderRequest
  ): Promise<void> => {
    setLoading(true);
    setError("");
    console.log("送信直前のformData:", JSON.stringify(formData, null, 2));

    try {
      const res = await api.post(`/orders`, formData);
      const response = res.data.data;
      alert(`発注登録に成功しました（発注番号: ${response.orderNo}）`);
      if (resetFormRef.current) {
        resetFormRef.current();
      }
      handleFormReset();
      setError("");
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data: ApiErrorResponse } }
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        alert(`エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${error.error}\n・massage: ${error.message}\n・status: ${error.status}`); // エラーメッセージを利用
      }
      setError("登録に失敗しました。");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {error && <div className="text-red-500">{error}</div>}
    <main className="max-w-8xl mx-auto bg-white border-gray-400 shadow p-5">
      <AssetOrderForm onSubmit={handleOrderSubmit} onReset={handleFormReset} />
    </main>
    </>
  );
}
