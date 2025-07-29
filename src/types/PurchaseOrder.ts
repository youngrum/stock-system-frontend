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
  manufacturer?: string;
  category: string;
  price: number;
  itemType: string; // 商品種別(在庫品発注の場合は"ITME"統一)
  quantity: number;
  location: string;
  remarks: string;
}

// 発注登録値のレスポンス型
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
  id: long;
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
