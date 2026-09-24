import { prisma } from "@/lib/prisma";


import type {
  CustomerDashboardSummary,
} from "./summary.types";




// =========================
// GET CUSTOMER DASHBOARD SUMMARY
// =========================

export async function getCustomerDashboardSummary(

  customerId:string

):Promise<CustomerDashboardSummary>{



  const customer = await prisma.customer.findUnique({

    where:{
      id:customerId,
    },


    select:{


      name:true,

      membership:true,

      totalSpent:true,

      createdAt:true,


      loyalty:{

        select:{

          points:true,

        },

      },


    },


  });





  if(!customer){

    throw new Error(
      "Customer tidak ditemukan"
    );

  }







  const [


    totalTransaction,


    lastTransaction,


    transactionItems,



  ] = await Promise.all([





    // TOTAL TRANSACTION
    prisma.transaction.count({

      where:{

        customerId,

        status:"COMPLETED",

      },

    }),





    // LAST TRANSACTION

    prisma.transaction.findFirst({

      where:{

        customerId,

      },


      orderBy:{

        createdAt:"desc",

      },


      select:{


        invoiceNumber:true,

        totalAmount:true,

        createdAt:true,


      },


    }),





    // PRODUCT PURCHASE

    prisma.transactionItem.findMany({

      where:{


        transaction:{

          customerId,

          status:"COMPLETED",

        },


      },


      select:{


        quantity:true,


        product:{

          select:{


            name:true,


          },

        },


      },

    }),





  ]);









  const productMap =

    new Map<string,number>();




  transactionItems.forEach((item)=>{


    const current =

      productMap.get(

        item.product.name

      )

      ??

      0;




    productMap.set(

      item.product.name,

      current + item.quantity

    );


  });







  let favoriteProduct = null;





  if(productMap.size > 0){


    const sorted =

      Array.from(

        productMap.entries()

      )

      .sort(

        (a,b)=>

        b[1]-a[1]

      );




    favoriteProduct={

      productName:sorted[0][0],

      totalPurchase:sorted[0][1],

    };


  }







  return {


    overview:{


      customerName:customer.name,


      membership:customer.membership,


      totalSpent:Number(customer.totalSpent),


      totalTransaction,


      loyaltyPoints:

        customer.loyalty?.points ?? 0,


    },





    lastTransaction:

      lastTransaction

      ?

      {

        invoiceNumber:

          lastTransaction.invoiceNumber,


        amount:

          Number(lastTransaction.totalAmount),


        date:

          lastTransaction.createdAt,


      }

      :

      null,







    favoriteProduct,







    customerSince:

      customer.createdAt,



  };


}