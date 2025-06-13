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
            <th className="text-base pl-4 pr-1 py-3 max-w-[60px]">入庫</th>
            <th className="text-base pl-4 pr-1 py-3 max-w-[60px]">出庫</th>
            <th className="text-base pl-4 pr-1 py-3">ID</th>
            <th className="text-base pl-4 pr-1 py-3">品名</th>
            <th className="text-base pl-4 pr-1 py-3">カテゴリ</th>
            <th className="text-base pl-4 pr-1 py-3">型番</th>
            <th className="text-base pl-4 pr-1 py-3">メーカー</th>
            <th className="text-base pl-4 pr-1 py-3">在庫数</th>
            <th className="text-base pl-4 pr-1 py-3">更新日</th>
            <th className="text-base pl-4 pr-1 py-3 line-through">履歴</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((item) => (
            <tr
              key={item.itemCode}
              className="hover:bg-gray-200"
              style={{ borderBottom: "1px solid #101540" }}
            >
              <td className="pl-4 pr-1 py-3 items-center max-w-[50px]" >
                <Link
                  href="#"
                  onClick={() => onReceive(item)}
                  className="text-[#0d113d]"
                >
                  <PackagePlus className="mx-auto" />
                </Link>
              </td>
              <td className="pl-4 pr-1 py-3 max-w-[50px]">
                <Link
                  href="#"
                  onClick={(e) => {
                    // currentStockが文字列の"0"と比較
                    if (item.currentStock === 0) {
                      e.preventDefault(); // クリックイベントをキャンセル
                    } else {
                      onDispach(item);
                    }
                  }}
                  className={`text-[#0d113d] ${item.currentStock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={item.currentStock == 0 ? "在庫0です" : undefined} // ホバー時のツールチップ
                >
                  <Truck className="mx-auto" />
                </Link>
              </td>
              <td className="px-4 py-3" title={item.itemCode}>{item.itemCode}</td>
              <td className="px-4 py-3 max-w-[300px] truncate"  title={item.itemName}>
                {item.itemName}
              </td>
              <td className="px-4 py-3" title={item.category}>{item.category}</td>
              <td className="px-4 py-3 max-w-[300px] truncate">
                {item.modelNumber ?? "-"}
              </td>
              <td className="px-4 py-3" title={item.manufacturer}>{item.manufacturer}</td>
              <td className="px-4 py-3">
                <span className={item.currentStock === 0 ? "text-red-500" : ""}>
                  {item.currentStock}
                </span>
                </td>
              <td className="px-4 py-3">{formatDate(item.lastUpdated)}</td>
              <td className="pl-4 pr-1 line-through">
                {/** 静的ファイルとしてビルドすると動的ページ生成できないのでリンク先閉鎖 */}
                {/* <Link
                  href={`/inventory/${item.itemCode}/transactions`}
                  className="text-[#0d113d]"
                >
                  <ExternalLink className="mx-auto" />
                </Link> */}
                <button
                  onClick={(e) => e.preventDefault()} // クリックイベントをキャンセル
                  className="text-[#0d113d] cursor-not-allowed"
                  disabled
                >
                  <ExternalLink className="mx-auto" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
