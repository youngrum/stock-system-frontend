// app/orders/new/page.tsx
import OrderForm from "@/components/order/OrderForm";
import {PurchaseOrder} from "@/types/PurchaseOrder"

export default function OrderNewPage() {
    const handleOrderSubmit = (formData : PurchaseOrder):void => {
    // APIにPOSTするなど
  };

  return (
    <main>
        <OrderForm onSubmit={handleOrderSubmit} />
    </main>
  );
}
