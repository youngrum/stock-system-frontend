export interface InventoryItem {
    itemCode: string
    itemName: string
    modelNumber?: string
    category: string
    currentStock: number
    lastUpdate: string
  }

export interface InventorySearchParams {
  itemCode?: string;
  itemName?: string;
  category?: string;
  modelNumber?: string;
}