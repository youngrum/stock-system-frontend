'use client';

import { X } from 'lucide-react';
import { TransactionDetail} from '@/types/PurchaseOrder'

interface Props {
  transaction: TransactionDetail;
  onClose: () => void;
}

export default function TransactionDetailModal({ transaction, onClose }: Props) {
  const stock = transaction.stockItem;
  const order = transaction.purchaseOrder;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#0d113d] opacity-40" onClick={onClose} />
      <div className="relative z-10 bg-white w-full max-w-xl max-h-[70vh] py-10 px-6 rounded-lg shadow-lg overflow-y-auto space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold">{stock.itemName}</h2>
        <h3 className="font-semibold">{stock.itemCode}</h3>
        <p className="text-sm text-gray-600">カテゴリ / 型番 <br/>{stock.category} / {stock.modelNumber}</p>

        <div className="space-y-2">
          <p>処理種別: {transaction.transactionType === 'ORDER_REGIST' ? '発注登録' :
            transaction.transactionType === 'MANUAL_DISPATCH' ? '出庫' : '入庫'}</p>
          <p>数量: {transaction.transactionType === 'MANUAL_DISPATCH' ? `-${transaction.quantity}` : `+${transaction.quantity}`}</p>
          <p>実行者: {transaction.operator}</p>
          <p>実行日: {transaction.transactionTime.slice(0, 10)}</p>
          <p>備考: {transaction.remarks || '-'}</p>
        </div>

        {['PURCHASE_RECEIVE', 'ORDER_REGIST'].includes(transaction.transactionType) && order && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold">発注情報</h3>
            <p>発注番号: {order.orderNo}</p>
            <p>発注日: {order.orderDate}</p>
            <p>仕入先: {order.supplier}</p>
            <p>送料: ￥{order.shippingFee}</p>
            <p>備考: {order.remarks || '-'}</p>
            <p className="font-medium mt-2">明細:</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {order.details?.map((d, i) => (
                <li key={i}>
                  {d.itemCode} - {d.itemName}（￥{d.purchasePrice} × {d.quantity}）
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
