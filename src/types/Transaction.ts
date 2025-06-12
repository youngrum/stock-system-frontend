export interface Transaction {
    transactionType: 'MANUAL_RECEIVE' | 'MANUAL_DISPATCH' | 'PURCHASE_RECEIVE' | 'ORDER_REGIST' | 'ITEM_REGIST';
    transactionId: bigint;
    quantity: number;
    operator: string;
    remarks: string;
    transactionTime: string;
    orderNo?: string | null;
    stockItem :{
      itemCode: string;
      itemName: string;
      category: string;
      modelNumber: string;
    }
    purchaseOrder: {
        orderNo: string,
        supplier: string,
        orderSubtotal: number,
        orderDate: string,
        shippingFee: number,
        operator: string,
        status: string,
        remarks: string,
        createdAt: string,
        details: 
        {
            purchasePrice: number,
            quantity: number,
            itemCode: string,
            itemName: string,
        }[]
    }
    totalPages: number;
}

export interface TransactionSearchParams {
    itemCode: string;
    operator: string;
    fromDate: string; 
    toDate: string; 
}