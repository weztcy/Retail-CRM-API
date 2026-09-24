import { prisma } from "@/lib/prisma";


import type {
  CustomerPurchaseAnalytics,
} from "./purchase.types";




// =========================
// GET CUSTOMER PURCHASE ANALYTICS
// =========================

export async function getCustomerPurchaseAnalytics(

  customerId:string

):Promise<CustomerPurchaseAnalytics>{



  const startDate = new Date();


  startDate.setMonth(

    startDate.getMonth() - 11

  );





  const [


    transactions,


    items,


  ] = await Promise.all([





    // =========================
    // CUSTOMER TRANSACTION
    // =========================


    prisma.transaction.findMany({

      where:{

        customerId,

        status:"COMPLETED",

      },


      select:{

        totalAmount:true,

        createdAt:true,

      },


    }),







    // =========================
    // PRODUCT PURCHASE
    // =========================


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


            id:true,

            name:true,

            category:true,


          },

        },



        createdAt:true,


      },


    }),





  ]);









  // =========================
  // OVERVIEW
  // =========================


  const totalTransaction =

    transactions.length;





  const totalSpent =

    transactions.reduce(

      (sum,item)=>

        sum +

        Number(item.totalAmount),

      0

    );





  const averageTransaction =

    totalTransaction

    ?

    totalSpent / totalTransaction

    :

    0;









  // =========================
  // SPENDING TREND
  // =========================


  const trendMap =

    new Map<string,number>();




  transactions.forEach((item)=>{


    const month =

      item.createdAt.toLocaleString(

        "en-US",

        {

          month:"short",

          year:"numeric",

        }

      );




    trendMap.set(

      month,

      (

        trendMap.get(month)

        ??

        0

      )

      +

      Number(item.totalAmount)

    );


  });









  // =========================
  // CATEGORY
  // =========================


  const categoryMap =

    new Map<string,number>();




  items.forEach((item)=>{


    const current =

      categoryMap.get(

        item.product.category

      )

      ??

      0;



    categoryMap.set(

      item.product.category,

      current +

      item.quantity

    );



  });








  // =========================
  // PRODUCT
  // =========================


  const productMap =

    new Map<

      string,

      {

        productName:string;

        quantity:number;

      }

    >();




  items.forEach((item)=>{


    const current =

      productMap.get(

        item.product.id

      )

      ??

      {

        productName:item.product.name,

        quantity:0,

      };





    current.quantity += item.quantity;




    productMap.set(

      item.product.id,

      current

    );



  });








  return {


    overview:{


      totalTransaction,


      totalSpent,


      averageTransaction,


    },





    spendingTrend:


      Array.from(

        trendMap.entries()

      )

      .map(([month,spent])=>({


        month,

        spent,


      })),






    favoriteCategory:


      Array.from(

        categoryMap.entries()

      )

      .map(([category,totalPurchase])=>({


        category,

        totalPurchase,


      }))

      .sort(

        (a,b)=>

          b.totalPurchase -

          a.totalPurchase

      ),






    favoriteProduct:


      Array.from(

        productMap.entries()

      )

      .map(([productId,value])=>({


        productId,


        productName:value.productName,


        quantity:value.quantity,


      }))

      .sort(

        (a,b)=>

          b.quantity -

          a.quantity

      )

      .slice(0,10),



  };


}