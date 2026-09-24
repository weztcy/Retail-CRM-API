import { prisma } from "@/lib/prisma";


import type {
  UserDashboardReport,
} from "./report.types";




// =========================
// GET USER REPORT DASHBOARD
// =========================

export async function getUserDashboardReport()

:Promise<UserDashboardReport>{



  const now = new Date();



  const startMonth =

    new Date(

      now.getFullYear(),

      now.getMonth(),

      1

    );





  const [


    transactions,


    transactionStatus,


    totalCustomer,


    newCustomer,


    activeCustomer,


    totalProduct,


    activeProduct,


    lowStock,


    products,


  ] = await Promise.all([





    // =========================
    // SALES REPORT
    // =========================


    prisma.transaction.findMany({

      where:{

        status:"COMPLETED",

        paymentStatus:"PAID",

      },


      select:{

        totalAmount:true,

      },

    }),






    // =========================
    // TRANSACTION STATUS
    // =========================


    prisma.transaction.groupBy({

      by:[

        "status",

      ],


      _count:{

        id:true,

      },


    }),






    // =========================
    // CUSTOMER REPORT
    // =========================


    prisma.customer.count(),




    prisma.customer.count({

      where:{

        createdAt:{

          gte:startMonth,

        },

      },

    }),




    prisma.customer.count({

      where:{

        isActive:true,

      },

    }),






    // =========================
    // PRODUCT REPORT
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
    // INVENTORY REPORT
    // =========================


    prisma.product.findMany({

      select:{

        stock:true,

        price:true,

      },

    }),





  ]);









  const totalRevenue =

    transactions.reduce(

      (total,item)=>

        total +

        Number(item.totalAmount),

      0

    );







  const stock =

    products.reduce(

      (total,item)=>

        total +

        item.stock,

      0

    );






  const stockValue =

    products.reduce(

      (total,item)=>

        total +

        (

          item.stock *

          Number(item.price)

        ),

      0

    );







  return {



    sales:{


      totalTransaction:

        transactions.length,


      totalRevenue,


      averageTransaction:

        transactions.length

        ?

        totalRevenue /

        transactions.length

        :

        0,



    },





    transactionStatus:


      transactionStatus.map((item)=>({


        status:item.status,


        total:item._count.id,


      })),






    customer:{


      totalCustomer,


      newCustomer,


      activeCustomer,


    },






    product:{


      totalProduct,


      activeProduct,


      lowStock,


    },







    inventory:{


      stock,


      stockValue,


    },


  };

}