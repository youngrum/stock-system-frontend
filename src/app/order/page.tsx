// app/order/new/page.tsx
"use client";

import OrderForm from "@/components/order/OrderForm";
import {
  PurchaseOrderRequest,
  PurchaseOrderDetailRequest,
} from "@/types/PurchaseOrder";
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
    formData: PurchaseOrderRequest
  ): Promise<void> => {
    setLoading(true);
    setError("");
    console.log("%o", formData);

    try {
      const res = await api.post(`/orders`, {
        supplier: formData.supplier,
        shippingFee: formData.shippingFee,
        orderDate: formData.orderDate,
        remarks: formData.remarks || "-",
        details: formData.details.map((item: PurchaseOrderDetailRequest) => ({
          itemCode: item.itemCode || "",
          itemName: item.itemName,
          category: item.category,
          modelNumber: item.modelNumber,
          purchasePrice: item.price || 0,
          quantity: item.quantity,
          remarks: item.remarks || "-",
        })),
      });

      const response = res.data.data;

      alert(`発注登録に成功しました（発注番号: ${response.orderNo}）`);

      if (resetFormRef.current) {
        resetFormRef.current();
      }
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
      <OrderForm onSubmit={handleOrderSubmit} onReset={handleFormReset} />
    </main>
    </>
  );
}
