import {
  z,
} from "zod";


export const createInventoryTransactionSchema =

z.object({

  productId:
    z.string().uuid(),


  userId:
    z.string().uuid(),


  transactionId:
    z.string().uuid().optional(),


  type:
    z.enum([

      "STOCK_OUT",

      "STOCK_IN",

      "ADJUSTMENT",

    ]),


  quantity:
    z.number().int().positive(),


  stockBefore:
    z.number().int(),


  stockAfter:
    z.number().int(),


  description:
    z.string().optional(),

});