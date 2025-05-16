// inventory/page.tsx
'use client'

import InventoryTable from '@/components/inventory/InventoryTable'
import { mockInventoryData } from '@/data/inventoryMock'
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

export default function InventoryListsPage() {
  const isLoggedIn = useAuthGuard();
  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="bg-white border p-3 shadow">
      <h2 className="text-lg font-bold text-gray-800" style={{ color: '#101540' }}>在庫一覧・検索</h2>
      {/* <InventorySearchForm /> */}
      <InventoryTable data={mockInventoryData} />
    </main>
  )
}
