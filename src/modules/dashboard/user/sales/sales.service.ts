import { prisma } from "@/lib/prisma";

import type {
  UserDashboardSales,
} from "./sales.types";




// =========================
// GET USER DASHBOARD SALES
// =========================

export async function getUserDashboardSales()

:Promise<UserDashboardSales>{



  const now = new Date();



  const startToday =
    new Date(

      now.getFullYear(),

      now.getMonth(),

      now.getDate()

    );



  const startMonth =
    new Date(

      now.getFullYear(),

      now.getMonth(),

      1

    );




  // 12 MONTH RANGE

  const startYear =
    new Date(

      now.getFullYear(),

      now.getMonth() - 11,

      1

    );





  const completedFilter = {


    status:"COMPLETED" as const,


    paymentStatus:"PAID" as const,


  };





  const [



    salesToday,


    salesMonth,


    transactionMonth,


    trendTransactions,


    paymentTransactions,


    topProductItems,



  ] = await Promise.all([





    // =========================
    // SALES TODAY
    // =========================

    prisma.transaction.aggregate({

      where:{

        ...completedFilter,

        transactionDate:{

          gte:startToday,

        },

      },


      _sum:{

        totalAmount:true,

      },


    }),





    // =========================
    // SALES MONTH
    // =========================

    prisma.transaction.aggregate({

      where:{

        ...completedFilter,

        transactionDate:{

          gte:startMonth,

        },

      },


      _sum:{

        totalAmount:true,

      },


    }),






    // =========================
    // TRANSACTION MONTH
    // =========================

    prisma.transaction.count({

      where:{

        ...completedFilter,

        transactionDate:{

          gte:startMonth,

        },

      },


    }),






    // =========================
    // TREND 12 MONTH
    // =========================

    prisma.transaction.findMany({

      where:{

        ...completedFilter,

        transactionDate:{

          gte:startYear,

        },

      },


      select:{


        totalAmount:true,


        transactionDate:true,


      },


    }),





    // =========================
    // PAYMENT METHOD
    // =========================

    prisma.transaction.findMany({

      where:{

        ...completedFilter,

      },


      select:{

        paymentMethod:true,

        totalAmount:true,

      },


    }),






    // =========================
    // TOP PRODUCT
    // =========================

    prisma.transactionItem.findMany({

      where:{


        transaction:{

          ...completedFilter,

        },


      },


      select:{


        quantity:true,


        subtotal:true,


        product:{

          select:{

            id:true,

            name:true,

          },

        },


      },


    }),



  ]);







  // =========================
  // PROCESS TREND
  // =========================

  const trendMap =
    new Map<string, {

      sales:number;

      transaction:number;

    }>();





  trendTransactions.forEach((item)=>{


    const date =
      item.transactionDate;



    const key =

      date.toLocaleString(
        "en-US",
        {
          month:"short",
          year:"numeric",
        }
      );



    const current =
      trendMap.get(key)
      ??
      {
        sales:0,
        transaction:0,
      };



    current.sales +=
      Number(item.totalAmount);



    current.transaction +=1;



    trendMap.set(
      key,
      current
    );


  });







  // =========================
  // PROCESS PAYMENT
  // =========================

  const paymentMap =
    new Map<string,{

      total:number;

      amount:number;

    }>();




  paymentTransactions.forEach((item)=>{


    const key =
      item.paymentMethod;



    const current =
      paymentMap.get(key)
      ??
      {
        total:0,
        amount:0,
      };



    current.total +=1;


    current.amount +=
      Number(item.totalAmount);



    paymentMap.set(
      key,
      current
    );


  });






  // =========================
  // PROCESS TOP PRODUCT
  // =========================

  const productMap =
    new Map<string,{

      productId:string;

      productName:string;

      quantity:number;

      sales:number;

    }>();




  topProductItems.forEach((item)=>{


    const id =
      item.product.id;



    const current =
      productMap.get(id)
      ??
      {

        productId:id,

        productName:item.product.name,

        quantity:0,

        sales:0,

      };



    current.quantity +=
      item.quantity;



    current.sales +=
      Number(item.subtotal);



    productMap.set(
      id,
      current
    );


  });






  const monthSales =

    Number(
      salesMonth._sum.totalAmount ?? 0
    );



  const averageTransaction =

    transactionMonth > 0

      ?

      monthSales / transactionMonth

      :

      0;






  return {


    overview:{


      today:

        Number(
          salesToday._sum.totalAmount ?? 0
        ),



      month:

        monthSales,



      averageTransaction,



    },



    trend:

      Array.from(
        trendMap.entries()
      )
      .map(([month,value])=>({

        month,

        ...value,

      })),




    paymentMethod:

      Array.from(
        paymentMap.entries()
      )
      .map(([method,value])=>({

        method,

        ...value,

      })),




    topProducts:

      Array.from(
        productMap.values()
      )
      .sort(
        (a,b)=>
          b.quantity - a.quantity
      )
      .slice(0,10),


  };


}