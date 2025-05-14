import InventoryTable from '@/components/inventory/InventoryTable'
import { InventoryItem } from '@/types/InventoryItem'

const mockData: InventoryItem[] = [
  {
    itemCode: 'SG-56-0001',
    itemName: '六角ボルト',
    modelNumber: 'M10×20 ユニクロ',
    category: 'ネジ・ナット類',
    currentStock: 12,
    lastUpdate: '2025-05-13'
  },
  {
    itemCode: 'SG-56-0002',
    itemName: 'コンデンサ',
    modelNumber: 'C-10U',
    category: '電子部品',
    currentStock: 88,
    lastUpdate: '2025-04-30'
  }
]

export default function InventoryListsPage() {
  return (
    <main className="p-4">
      <h2 className="bg-white text-lg font-bold text-gray-800">在庫一覧・検索</h2>
      {/* <InventorySearchForm /> */}
      <InventoryTable data={mockData} />
    </main>
  )
}
