import Link from "next/link";
import { AssetItem } from "@/types/AssetItem";
import { SquarePen } from "lucide-react";

export default function AssetTable({
  data,
  onUpdate,
}: {
  data: AssetItem[];
  onUpdate: (item: AssetItem) => void;
}) {
  return (
    <div className="overflow-x-auto bg-white relative">
      <table className="w-full text-[12px] text-center border-collapse table-fixed">
        <thead className="sticky top-0 bg-white z-10" style={{ color: "#101540" }}>
          <tr className="font-semibold">
            <th className="pl-4 pr-1 py-3 w-[80px] sticky left-0 bg-white z-20">更新</th> {/* min-wではなくwを指定するか、より大きなmin-w */}
            <th className="px-4 py-3 w-[100px]  sticky left-[80px] bg-white z-20">管理番号</th>
            <th className="px-4 py-3 w-[200px]">設備名</th>
            <th className="px-4 py-3 w-[150px]">型番・規格</th>
            <th className="px-4 py-3 w-[120px]">メーカー</th>
            <th className="px-4 py-3 w-[100px]">登録日</th>
            <th className="px-4 py-3 w-[150px]">保管/設置場所</th>
            <th className="px-4 py-3 w-[150px]">製造番号</th>
            <th className="px-4 py-3 w-[120px]">購入金額</th>
            <th className="px-4 py-3 w-[120px]">カテゴリー</th>
            <th className="px-4 py-3 w-[180px]">固定資産管理番号</th>
            <th className="px-4 py-3 w-[120px]">前回校正日</th>
            <th className="px-4 py-3 w-[120px]">次回校正期限</th>
            <th className="px-4 py-3 w-[100px]">ステータス</th> {/* locationからstatusに変更されている点も修正 */}
            <th className="px-4 py-3 w-[200px]">備考</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((item) => (
            <tr
              key={item.itemCode}
              className="hover:bg-gray-200"
              style={{ borderBottom: "1px solid #101540" }}
            >
              <td className="pl-4 pr-1 py-3 items-center max-w-[50px] sticky left-0 bg-white z-20 " >
                <Link
                  href="#"
                  onClick={() => onUpdate(item)}
                  className="text-[#0d113d]"
                >
                  <SquarePen className="mx-auto" />
                </Link>
              </td>
              <td className="px-4 py-3 sticky left-[80px] bg-white z-20 " title={item.assetCode}>
                {item.assetCode ?? "-"}
                </td>
              <td className="px-4 py-3" title={item.assetName}>
                {item.assetName ?? "-"}
                </td>
              <td className="px-4 py-3" title={item.modelNumber}>
                {item.modelNumber ?? "-"}
                </td>
              <td className="px-4 py-3" title={item.manufacturer}>
                {item.manufacturer ?? "-"}
                </td>
              <td className="px-4 py-3" title={item.registDate}>
                {item.registDate ?? "-"}
                </td>
              <td className="px-4 py-3" title={item.location}>
                {item.location ?? "-"}
              </td>
              <td className="px-4 py-3" title={item.serialNumber}>
                {item.serialNumber ?? "-"}
              </td>
              <td className="px-4 py-3 max-w-[300px] truncate" title={item.purchasePrice}>
                {item.purchasePrice}
              </td>
              <td className="px-4 py-3 max-w-[300px] truncate"  title={item.category}>
                {item.category ?? "-"} 
              </td>
              <td className="px-4 py-3" title={item.fixedAssetManageNo}>
                {item.fixedAssetManageNo ?? "-"}
                </td>
              <td className="px-4 py-3" title={item.lastCalibrationDate}>
                  {item.lastCalibrationDate ?? "-"}
              </td>
              <td className="px-4 py-3" title={item.nextCalibrationDate}>
                  {item.nextCalibrationDate ?? "-"}
              </td>
              <td className="px-4 py-3" title={item.location}>
                {item.location}
              </td>
              <td className="px-4 py-3 truncate  max-w-[150px]" title={item.remarks}>
                {item.remarks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
