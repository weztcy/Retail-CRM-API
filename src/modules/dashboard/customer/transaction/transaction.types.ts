// =========================
// CUSTOMER TRANSACTION TYPES
// =========================


export interface CustomerTransactionHistory {


  summary: {

    totalTransaction: number;

    totalSpent: number;

  };



  transactions: {

    id: string;

    invoiceNumber: string;

    transactionDate: Date;

    totalAmount: number;

    paymentMethod: string;

    paymentStatus: string;

    status: string;


    items: {

      productId: string;

      productName: string;

      quantity: number;

      price: number;

      subtotal: number;

    }[];


  }[];


}