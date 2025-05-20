export interface InventoryItem {
  itemCode: string;
  itemName: string;
  modelNumber?: string;
  category: string;
  currentStock: number;
  lastUpdated: string;
  supplier?: string;
  manufacturer?: string;
  purchasePrice?: number;
  shoppingFee?: number;
  quantity: number;
  remarks?: string;
}

export interface InventorySearchParams {
  itemCode?: string;
  itemName?: string;
  category?: string;
  modelNumber?: string;
}