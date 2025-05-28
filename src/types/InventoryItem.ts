export interface InventoryItem {
  itemCode: string;
  itemName: string;
  modelNumber: string;
  category: string;
  currentStock: number;
  supplier: string;
  manufacturer: string;
  purchasePrice: number;
  shoppingFee: number;
  quantity: number;
  lastUpdated: string;
  remarks: string;
}

export interface InventorySearchParams {
  itemCode?: string;
  itemName?: string;
  category?: string;
  modelNumber?: string;
}

export interface CreateInventoryRequest {
  itemName: string;
  category: string;
  modelNumber: string;
  manufacturer: string;
  currentStock: number;
  remarks: string;
}
