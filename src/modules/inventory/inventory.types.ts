export type CreateInventoryTransactionInput = {

  productId: string;

  userId: string;

  transactionId?: string;

  type:
    | "STOCK_OUT"
    | "STOCK_IN"
    | "ADJUSTMENT";

  quantity: number;

  stockBefore: number;

  stockAfter: number;

  description?: string;

};

export type CreateInventoryAdjustmentInput = {

  productId: string;

  quantity: number;

  description?: string;

};