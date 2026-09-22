import {
  prisma,
} from "@/lib/prisma";


import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  ApiError,
} from "@/utils/errors/api-error";


import {
  createAuditLog,
} from "@/modules/audit/audit.service";

import type {
  CreateInventoryTransactionInput,
  CreateInventoryAdjustmentInput,
} from "./inventory.types";




// =========================
// CREATE INVENTORY TRANSACTION
// =========================

export async function createInventoryTransaction(

  data: CreateInventoryTransactionInput,

  db:
    | Prisma.TransactionClient
    | typeof prisma = prisma

) {


  const inventoryTransaction =

    await db.inventoryTransaction.create({

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




  return inventoryTransaction;


}
// =========================
// CREATE STOCK ADJUSTMENT
// =========================


export async function createInventoryAdjustment(

  data:
    CreateInventoryAdjustmentInput,

  userId:string

){


return await prisma.$transaction(

async(tx)=>{


// =========================
// CHECK PRODUCT
// =========================


const product =

await tx.product.findUnique({

where:{
 id:data.productId,
},


});



if(!product){


throw new ApiError(

"Product tidak ditemukan",

404

);


}




// =========================
// CALCULATE STOCK
// =========================


const stockBefore =
product.stock;



const stockAfter =
stockBefore + data.quantity;



if(stockAfter < 0){


throw new ApiError(

"Stock tidak boleh negatif",

400

);


}





// =========================
// UPDATE PRODUCT
// =========================


await tx.product.update({

where:{
 id:data.productId,
},


data:{


stock:
stockAfter,


},


});




// =========================
// CREATE INVENTORY LOG
// =========================


const inventory =

await tx.inventoryTransaction.create({


data:{


productId:

product.id,


userId,


type:

"ADJUSTMENT",


quantity:

Math.abs(data.quantity),


stockBefore,


stockAfter,


description:

data.description ??

"Manual stock adjustment",


},


});




// =========================
// AUDIT LOG
// =========================


await createAuditLog({

userId,


action:

"UPDATE",


module:

"INVENTORY",


description:

`Adjustment stock ${product.name} (${stockBefore} -> ${stockAfter})`,


});




return inventory;



}

);


}