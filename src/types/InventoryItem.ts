// 在庫アイテムの型定義
export interface InventoryItem {
  itemCode: string;
  itemName: string;
  modelNumber: string;
  category: string;
  currentStock: number;
  supplier: string;
  manufacturer: string;
  purchasePrice: number;
  shippingFee: number;
  quantity: number;
  price: number;
  lastUpdated: string;
  location: string;
  remarks: string;
}
// 在庫検索のパラメータの型定義
export interface InventorySearchParams {
  itemCode?: string;
  itemName?: string;
  category?: string;
  modelNumber?: string;
}

// 在庫新規登録の型定義
export interface CreateInventoryRequest {
  itemName: string;
  category: string;
  modelNumber: string;
  manufacturer: string;
  currentStock: number;
  location: string;
  remarks: string;
}
