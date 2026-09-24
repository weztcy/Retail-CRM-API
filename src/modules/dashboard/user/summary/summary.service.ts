import { prisma } from "@/lib/prisma";

import type {
  UserDashboardSummary,
} from "./summary.types";



// =========================
// GET USER DASHBOARD SUMMARY
// =========================

export async function getUserDashboardSummary()

:Promise<UserDashboardSummary>{



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





  const [
    totalCustomer,

    activeCustomer,

    newCustomerThisMonth,


    totalProduct,

    activeProduct,

    lowStockProduct,


    totalTransaction,

    transactionToday,

    transactionMonth,


    salesToday,

    salesMonth,

  ] = await Promise.all([



    // =========================
    // CUSTOMER
    // =========================


    prisma.customer.count(),



    prisma.customer.count({

      where:{
        isActive:true,
      },

    }),



    prisma.customer.count({

      where:{

        createdAt:{
          gte:startMonth,
        },

      },

    }),





    // =========================
    // PRODUCT
    // =========================


    prisma.product.count(),



    prisma.product.count({

      where:{
        isActive:true,
      },

    }),



    prisma.product.count({

      where:{

        stock:{
          lte:10,
        },

      },

    }),





    // =========================
    // TRANSACTION
    // =========================


    prisma.transaction.count({



      where:{

        status:"COMPLETED",

        paymentStatus:"PAID",

      },


    }),





    prisma.transaction.count({



      where:{


        status:"COMPLETED",


        paymentStatus:"PAID",


        transactionDate:{
          gte:startToday,
        },


      },


    }),






    prisma.transaction.count({



      where:{


        status:"COMPLETED",


        paymentStatus:"PAID",


        transactionDate:{
          gte:startMonth,
        },


      },


    }),





    // =========================
    // SALES TODAY
    // =========================


    prisma.transaction.aggregate({



      where:{


        status:"COMPLETED",


        paymentStatus:"PAID",


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


        status:"COMPLETED",


        paymentStatus:"PAID",


        transactionDate:{
          gte:startMonth,
        },


      },



      _sum:{

        totalAmount:true,

      },


    }),



  ]);






  return {


    customer:{


      total:
        totalCustomer,


      active:
        activeCustomer,


      newThisMonth:
        newCustomerThisMonth,


    },




    product:{


      total:
        totalProduct,


      active:
        activeProduct,


      lowStock:
        lowStockProduct,


    },





    transaction:{


      total:
        totalTransaction,


      today:
        transactionToday,


      month:
        transactionMonth,


    },





    sales:{


      today:

        Number(
          salesToday._sum.totalAmount ?? 0
        ),



      month:

        Number(
          salesMonth._sum.totalAmount ?? 0
        ),


    },



  };


}