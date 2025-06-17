// 発注登録のリクエスト型
export interface PurchaseOrderRequest {
  supplier: string;
  shippingFee: number;
  remarks?: string;
  orderDate?: string;
  details: PurchaseOrderDetailRequest[];
}

export interface PurchaseOrderDetailRequest {
  itemCode?: string;
  itemName?: string;
  modelNumber?: string;
  category: string;
  price: number;
  quantity: number;
  location: string;
  remarks: string;
}

// 発注登録地のレスポンス型
export interface PurchaseOrderResponse {
  orderNo: string;
  supplier: string;
  orderSubtotal: number;
  operator: string;
  orderDate: string;
  shippingFee: number;
  status: string;
  remarks?: string;

  details?: PurchaseOrderDetailResponse[];
}

export interface PurchaseOrderDetailResponse {
  orderNo: string; // どの発注の明細か
  itemCode: string;
  itemName: string;
  modelNumber: string;
  category: string;
  purchasePrice: number;
  quantity: number;
  status: string; // 納品済みかなど
  receivedQuantity?: number; // 納品数など追加用途
}
