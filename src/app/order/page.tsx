// app/orders/new/page.tsx
"use client";

import OrderForm from "@/components/order/OrderForm";
import { PurchaseOrderRequest } from "@/types/PurchaseOrder";

export default function OrderNewPage() {
  const handleOrderSubmit = (formData: PurchaseOrderRequest): void => {
    console.log("%o", formData);
  };

  return (
    <main className="max-w-8xl mx-auto bg-white border-gray-400 shadow p-5">
      <OrderForm onSubmit={handleOrderSubmit} />
    </main>
  );
}
