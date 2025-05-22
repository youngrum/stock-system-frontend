import Link from "next/link";
import { InventoryItem } from "@/types/InventoryItem";
import { ExternalLink, PackagePlus, Truck } from "lucide-react";
import { formatDate } from "@/lib/utils/dateFormat";

export default function InventoryTable({
  data,
  onReceive,
  onDispach,
}: {
  data: InventoryItem[];
  onReceive: (item: InventoryItem) => void;
  onDispach: (item: InventoryItem) => void;
}) {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-sm text-center border-collapse">
        <thead style={{ color: "#101540" }}>
          <tr className="font-semibold">
            <th className="text-base px-4 py-3">入庫</th>
            <th className="text-base px-4 py-3">出庫</th>
            <th className="text-base px-4 py-3">ID</th>
            <th className="text-base px-4 py-3">品名</th>
            <th className="text-base px-4 py-3">カテゴリ</th>
            <th className="text-base px-4 py-3">型番</th>
            <th className="text-base px-4 py-3">在庫数</th>
            <th className="text-base px-4 py-3">更新日</th>
            <th className="text-base px-4 py-3">履歴</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((item) => (
            <tr key={item.itemCode} className="hover:bg-gray-200" style={{ borderBottom: '1px solid #101540' }}>

              <td className="px-4 py-3 items-center">
                <Link
                  href="#"
                  onClick={() => onReceive(item)}
                  className="text-[#0d113d]"
                >
                  <PackagePlus className="mx-auto" />
                </Link>
              </td>
              <td className="px-4 py-3">
                <Link
                  href="#"
                  onClick={() => onDispach(item)}
                  className="text-[#0d113d]"
                >
                  <Truck className="mx-auto" />
                </Link>
              </td>
              <td className="px-4 py-3">{item.itemCode}</td>
              <td className="px-4 py-3 max-w-[300px] truncate">
                {item.itemName}
              </td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3 max-w-[300px] truncate">
                {item.modelNumber ?? "-"}
              </td>
              <td className="px-4 py-3">{item.currentStock}</td>
              <td className="px-4 py-3">{formatDate(item.lastUpdated)}</td>
              <td className="px-4 py-3">
                <Link href={`/inventory/${item.itemCode}/transactions`} className="text-[#0d113d]">
                  <ExternalLink className="mx-auto" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
