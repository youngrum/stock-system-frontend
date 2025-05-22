"use client";

import { useEffect, useState } from "react";
import { Transaction } from '@/types/Transaction';
import { PackagePlus, Truck, Bookmark} from "lucide-react";
import  Pagination from "@/components/ui/Pagination"
import { InventoryItem } from '@/types/InventoryItem';
import api from "@/services/api";

type Props = {
    params: {
      itemCode: string;
    };
  };
  
  export default function InventoryTransactionPage({ params }: Props) {
  const itemCode = params.itemCode;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stockInfo, setStockInfo] = useState<InventoryItem | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (!itemCode) return;

    const fetchData = async () => {
      try {
        const txRes = await api.get(`/inventory/${itemCode}/history`,{
          params: {
            page,  // ← 0始まり
            size: 10  // ← 1ページあたりの件数
          }});
        setTransactions(txRes.data.data.content);
        setTotalPages(txRes.data.data.totalPages);

        const stockRes = await api.get(`/inventory/${itemCode}`);
        setStockInfo(stockRes.data.data);
      } catch (err) {
        console.error("Error fetching inventory data:", err);
      }
    };

    fetchData();
  }, [itemCode, page]);

  return (
    <div className="bg-white border-gray-400 p-3 shadow p-5">
      <h2 className="text-2xl font-bold mb-2">在庫トランザクション - {itemCode}</h2>
      {stockInfo && (
        <h3 className="text-md text-gray-600 mb-6">
          {stockInfo.itemName} ／ {stockInfo.category} ／ {stockInfo.modelNumber}
        </h3>
      )}

      <table className="w-full text-sm text-center border-collapse">
        <thead style={{ color: "#101540" }}>
          <tr>
            <th className="py-2 px-3">種別</th>
            <th className="py-2 px-3">実行日</th>
            <th className="py-2 px-3">実行者</th>
            <th className="py-2 px-3">数量</th>
            <th className="py-2 px-3">備考</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {transactions.map((tx) => (
            <tr key={tx.transactionId} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3">
              {tx.transactionType === "MANUAL_RECEIVE" ? (
                  <div className="text-green-800 flex justify-center items-center">
                    <PackagePlus className="w-5 h-5 mr-1" />
                    入庫
                  </div>
                ) : tx.transactionType === "ORDER_REGIST" ? (
                  <div className="text-blue-800 flex justify-center items-center">
                    <Bookmark className="w-5 h-5 mr-1" />
                    発注登録
                  </div>
                ) : (
                  <div className="text-red-800 flex justify-center items-center">
                    <Truck className="w-5 h-5 mr-1" />
                    出庫
                  </div>
                )}
              </td>
              <td className="py-2 px-3">{tx.transactionTime?.slice(0, 10)}</td>
              <td className="py-2 px-3">{tx.operator}</td>
              <td className="py-2 px-3">
              {tx.transactionType === "MANUAL_DISPATCH" ? `-${tx.quantity}`
                : tx.transactionType === "ORDER_REGIST" ? `(${tx.quantity})`
                : `+${tx.quantity}`}
            </td>
              <td className="py-2 px-3">{tx.remarks || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
