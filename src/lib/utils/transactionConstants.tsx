
import { PackagePlus, Bookmark, Truck, PlusSquare } from 'lucide-react';

export const transactionDisplayMap = {
  MANUAL_RECEIVE: {
    icon: <PackagePlus className="w-5 h-5 mr-1" />,
    text: '入庫',
    color: 'text-green-800',
  },
  PURCHASE_RECEIVE: {
    icon: <PackagePlus className="w-5 h-5 mr-1" />,
    text: '入庫',
    color: 'text-green-800',
  },
  ORDER_REGIST: {
    icon: <Bookmark className="w-5 h-5 mr-1" />,
    text: '発注登録',
    color: 'text-blue-800',
  },
  ITEM_REGIST: {
    icon: <PlusSquare className="w-5 h-5 mr-1" />,
    text: '在庫登録（ID採番）',
    color: 'text-gray-600',
  },
  DISPATCH: { // おそらく '出庫' に対応する TransactionType
    icon: <Truck className="w-5 h-5 mr-1" />,
    text: '出庫',
    color: 'text-red-800',
  },
  // 必要に応じて他のタイプも追加
  // DEFAULT: { // マッピングにない場合のデフォルト値（任意）
  //   icon: null,
  //   text: '不明',
  //   color: 'text-gray-500',
  // }
};