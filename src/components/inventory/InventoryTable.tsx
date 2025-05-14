'use client'

import { InventoryItem } from '@/types/InventoryItem'

type InventoryTableProps = {
  data: InventoryItem[]
}

export default function InventoryTable({ data }: InventoryTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">品名</th>
            <th className="px-4 py-2 border">型番</th>
            <th className="px-4 py-2 border">カテゴリ</th>
            <th className="px-4 py-2 border text-right">在庫数</th>
            <th className="px-4 py-2 border">更新日</th>
            <th className="px-4 py-2 border">履歴</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.itemCode} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{item.itemCode}</td>
              <td className="px-4 py-2 border">{item.itemName}</td>
              <td className="px-4 py-2 border">{item.modelNumber ?? '-'}</td>
              <td className="px-4 py-2 border">{item.category}</td>
              <td className="px-4 py-2 border text-right">{item.currentStock}</td>
              <td className="px-4 py-2 border">{item.lastUpdate}</td>
              <td className="px-4 py-2 border text-center">
                <button className="text-blue-600 hover:underline">▶</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}