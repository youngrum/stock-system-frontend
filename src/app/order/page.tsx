// app/order/new/page.tsx
"use client";

import OrderForm from "@/components/order/OrderForm";
import {
  PurchaseOrderRequest,
  PurchaseOrderDetailRequest,
} from "@/types/PurchaseOrder";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderNewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

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
        remarks: formData.remarks || "",
        details: formData.details.map((item: PurchaseOrderDetailRequest) => ({
          itemCode: item.itemCode || "",
          itemName: item.itemName,
          category: item.category,
          modelNumber: item.modelNumber,
          purchasePrice: item.price || 0,
          quantity: item.quantity,
          remarks: item.remarks || "",
        })),
      });

      const response = res.data.data;

      alert(`発注登録に成功しました（発注番号: ${response.orderNo}）`);

      router.push("/order");
    } catch (err) {
      setError("登録に失敗しました。");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-8xl mx-auto bg-white border-gray-400 shadow p-5">
      <OrderForm onSubmit={handleOrderSubmit} />
    </main>
  );
}
