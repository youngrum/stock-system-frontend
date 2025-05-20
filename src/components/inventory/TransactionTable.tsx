'use client';

import { PackagePlus, Truck, ExternalLink, Bookmark } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateFormat';
import { Transaction } from '@/types/Transaction'
import { TransactionDetail } from '@/types/PurchaseOrder'
import TransactionDetailModal from './TransactionDetailModalTransactionDetailModal';
import Link from 'next/link';
import { useState } from 'react';

export default function TransactionTable({ data }: { data: Transaction[] }) {
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-sm text-center border-collapse">
        <thead style={{ color: '#101540' }}>
          <tr className="font-semibold">
            <th className="px-4 py-2">種別</th>
            <th className="px-4 py-2">実行日</th>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">品名</th>
            <th className="px-4 py-2">数量</th>
            <th className="px-4 py-2">実行者</th>
            <th className="px-4 py-2">備考</th>
            <th className="px-4 py-2">詳細</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((tx, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
              {tx.transactionType === 'MANUAL_RECEIVE' ? (
                    <div className="text-green-800 flex justify-center items-center">
                        <PackagePlus className="w-5 h-5 mr-1" />
                    入庫
                    </div>
                ) : tx.transactionType === 'ORDER_REGIST' ? (
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
              <td className="px-4 py-2">{formatDate(tx.transactionTime)}</td>
              <td className="px-4 py-2">{tx.stockItem.itemCode || '-'}</td>
              <td className="px-4 py-2 max-w-[200px] truncate whitespace-nowrap">{tx.stockItem.itemName || '-'}</td>
              <td className="px-4 py-2">
                {tx.transactionType === 'ORDER_REGIST' ? (
                    <span className="text-gray-500">({tx.quantity})</span>
                    ) : tx.transactionType === 'MANUAL_RECEIVE' || tx.transactionType === 'PURCHASE_RECEIVE' ? (
                        `+${tx.quantity}`
                    ) : (
                        `-${tx.quantity}`
                    )}
              </td>
              <td className="px-4 py-2">{tx.operator}</td>
              <td className="px-4 py-2 max-w-[200px] truncate whitespace-nowrap">{tx.remarks || '-'}</td>
              <td className="px-4 py-2">
                {tx.purchaseOrder?.orderNo ? (
                  <Link href="#" onClick={() => setSelectedTransaction(tx)} className="text-[#0d113d]">
                    <ExternalLink className="mx-auto" />
                  </Link>
                ) : (
                  <span className="text-gray-400">ー</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          {selectedTransaction && (
          <TransactionDetailModal
              transaction={selectedTransaction}
              onClose={() => setSelectedTransaction(null)}
          />
          )}
    </div>
  );
}
