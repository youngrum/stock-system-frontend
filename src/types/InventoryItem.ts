export interface InventoryItem {
    itemCode: string
    itemName: string
    modelNumber?: string
    category: string
    currentStock: number
    lastUpdated: string
  }

export interface InventorySearchParams {
  itemCode?: string;
  itemName?: string;
  category?: string;
  modelNumber?: string;
}

export interface RecieveItem {
  itemCode: string
  itemName: string
  modelNumber?: string
  supplier?: string
  manufacturer?: string
  purchasePrice?: number
  shoppingFee?: number
  category: string
  quantity: number
  remarks: string
  currentStock: number
}