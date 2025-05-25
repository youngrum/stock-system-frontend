export interface PurchaseOrderDetail {
  itemCode: string;
  itemName: string;
  purchasePrice: number;
  quantity: number;
}

export interface PurchaseOrder {
  orderNo: string;
  supplier: string;
  orderSubtotal: number;
  orderDate: string;
  shippingFee: number;
  remarks?: string;
  details?: PurchaseOrderDetail[];
}

export interface TransactionDetail {
  transactionId: number;
  transactionType: string;
  quantity: number;
  operator: string;
  remarks?: string;
  transactionTime: string;
  stockItem: {
    itemCode: string;
    itemName: string;
    modelNumber: string;
    category: string;
  };
  purchaseOrder?: PurchaseOrder;
}

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
  remarks: string;
}

export interface OrderItem {
  itemCode: string;
  itemName: string;
  category: string;
  modelNumber: string;
  price: number;
  quantity: number;
  remarks: string;

  autoFetchRequired?: boolean;
  autoSuggestRequired?: boolean;
  readOnlyFields?: {
    itemName: boolean;
    category: boolean;
    modelNumber: boolean;
  };
}

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
  // その他表示・更新に必要なフィールド
}
