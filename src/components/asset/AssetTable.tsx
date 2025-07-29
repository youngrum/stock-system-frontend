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
            <th className="pl-4 pr-1 py-3 w-[80px] sticky left-0 bg-white z-5">更新</th> {/* min-wではなくwを指定するか、より大きなmin-w */}
            <th className="px-4 py-3 w-[100px]  sticky left-[80px] bg-white z-5">管理番号</th>
            <th className="px-4 py-3 w-[200px]">設備名</th>
            <th className="px-4 py-3 w-[150px]">型番・規格</th>
            <th className="px-4 py-3 w-[120px]">メーカー</th>
            <th className="px-4 py-3 w-[100px]">登録日</th>
            <th className="px-4 py-3 w-[150px]">保管/設置場所</th>
            <th className="px-4 py-3 w-[150px]">製造番号</th>
            <th className="px-4 py-3 w-[120px]">購入金額</th>
            <th className="px-4 py-3 w-[150px]">カテゴリー</th>
            <th className="px-4 py-3 w-[180px]">固定資産管理番号</th>
            <th className="px-4 py-3 w-[120px]">前回校正日</th>
            <th className="px-4 py-3 w-[120px]">次回校正期限</th>
            <th className="px-4 py-3 w-[100px]">ステータス</th>
            <th className="px-4 py-3 w-[300px]">備考</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((asset) => (
            <tr
              key={asset.id}
              className="hover:bg-gray-200"
              style={{ borderBottom: "1px solid #101540" }}
            >
              <td className="pl-4 pr-1 py-3 items-center max-w-[50px] sticky left-0 bg-white z-5" >
                <Link
                  href="#"
                  onClick={() => onUpdate(asset)}
                  className="text-[#0d113d]"
                >
                  <SquarePen className="mx-auto" />
                </Link>
              </td>
              <td className="px-4 py-3 sticky left-[80px] bg-white z-5" title={asset.assetCode}>
                {asset.assetCode ?? "-"}
                </td>
              <td className="px-4 py-3" title={asset.assetName}>
                {asset.assetName ?? "-"}
                </td>
              <td className="px-4 py-3" title={asset.modelNumber}>
                {asset.modelNumber ?? "-"}
                </td>
              <td className="px-4 py-3" title={asset.manufacturer}>
                {asset.manufacturer ?? "-"}
                </td>
              <td className="px-4 py-3" title={asset.registDate}>
                {asset.registDate ?? "-"}
                </td>
              <td className="px-4 py-3" title={asset.location}>
                {asset.location ?? "-"}
              </td>
              <td className="px-4 py-3" title={asset.serialNumber}>
                {asset.serialNumber ?? "-"}
              </td>
              <td className="px-4 py-3 max-w-[300px] truncate">
                {asset.purchasePrice === 0 ? "不明" : asset.purchasePrice}
              </td>
              <td className="px-4 py-3 max-w-[300px] truncate"  title={asset.category}>
                {asset.category ?? "-"} 
              </td>
              <td className="px-4 py-3" title={asset.fixedAssetManageNo}>
                {asset.fixedAssetManageNo ?? "-"}
                </td>
              <td className="px-4 py-3" title={asset.lastCalibrationDate}>
                  {asset.lastCalibrationDate ?? "-"}
              </td>
              <td className="px-4 py-3" title={asset.nextCalibrationDate}>
                  {asset.nextCalibrationDate ?? "-"}
              </td>
              <td className="px-4 py-3 truncate  max-w-[150px]" title={asset.status}>
                {asset.status}
              </td>
              <td className="px-4 py-3 truncate  max-w-[150px]" title={asset.remarks}>
                {asset.remarks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
