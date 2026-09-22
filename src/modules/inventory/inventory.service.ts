import {
  prisma,
} from "@/lib/prisma";


import type {
  CreateInventoryTransactionInput,
} from "./inventory.types";



// =========================
// CREATE INVENTORY TRANSACTION
// =========================

export async function createInventoryTransaction(
  data: CreateInventoryTransactionInput
) {


  return await prisma.inventoryTransaction.create({

    data: {

      productId:
        data.productId,


      userId:
        data.userId,


      transactionId:
        data.transactionId,


      type:
        data.type,


      quantity:
        data.quantity,


      stockBefore:
        data.stockBefore,


      stockAfter:
        data.stockAfter,


      description:
        data.description,

    },


  });


}