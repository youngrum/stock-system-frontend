export interface Transaction {
    transactionType: 'MANUAL_RECEIVE' | 'MANUAL_DISPATCH' | 'PURCHASE_RECEIVE' | 'ORDER_REGIST';
    quantity: number;
    operator: string;
    remarks: string;
    transactionTime: string;
    orderNo?: string | null;
    stockItem :{
      itemCode: string;
      itemName: string;
    }
    purchaseOrder: {
        orderNo: string,
        supplier: string,
        orderSubtotal: number,
        orderDate: Date,
        shippingFee: number,
        operator: string,
        status: string,
        remarks: string,
        createdAt: Date,
        details: []
    }
}
