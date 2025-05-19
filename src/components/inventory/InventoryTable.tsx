import Link from 'next/link'
import { InventoryItem } from '@/types/InventoryItem'
import { CircleArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateFormat';

export default function InventoryTable({
  data,
  onReceive,
}: {
  data: InventoryItem[];
  onReceive: (item: InventoryItem) => void;
}) {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-sm text-center border-collapse">
        <thead className="text-gray-700" style={{ color: '#101540' }} >
          <tr className="font-semibold">
            <th className="px-4 py-3">入庫</th>
            <th className="px-4 py-3">出庫</th>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">品名</th>
            <th className="px-4 py-3">カテゴリ</th>
            <th className="px-4 py-3">型番</th>
            <th className="px-4 py-3">在庫数</th>
            <th className="px-4 py-3">更新日</th>
            <th className="px-4 py-3">履歴</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((item) => (
            <tr key={item.itemCode} className="hover:bg-blue-50" style={{ borderBottom: '1px solid #101540' }}>
              <td className="px-4 py-3">
                {/* <Link
                  href={`/inventory/receive/${item.itemCode}`}
                  className="text-blue-600 hover:underline"
                >
                  ▶
                </Link> */}
                <button onClick={() => onReceive(item)} className="text-blue-600"><CircleArrowRight /></button>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/inventory/dispatch/${item.itemCode}`}
                  className="text-red-600 hover:underline"
                >
                  <CircleArrowRight />
                </Link>
              </td>
              <td className="px-4 py-3">{item.itemCode}</td>
              <td className="px-4 py-3">{item.itemName}</td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3">{item.modelNumber ?? '-'}</td>
              <td className="px-4 py-3">{item.currentStock}</td>
              <td className="px-4 py-3">{formatDate(item.lastUpdated)}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/inventory/transaction?itemCode=${item.itemCode}`}
                  className="text-gray-600 hover:underline"
                >
                  ▶
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
