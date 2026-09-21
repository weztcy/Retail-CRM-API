export interface CreateTransactionItemInput {

  productId: string;

  quantity: number;

}



export type CreateTransactionInput = {

  customerId: string;


  paymentMethod:
    | "CASH"
    | "CARD"
    | "TRANSFER"
    | "EWALLET"
    | "QRIS";


  paymentStatus?:
    | "UNPAID"
    | "PAID"
    | "REFUND";


  notes?: string;


  items: {

    productId: string;

    quantity: number;

  }[];

};