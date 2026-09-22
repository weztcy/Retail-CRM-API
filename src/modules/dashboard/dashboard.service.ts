import { prisma } from "@/lib/prisma";



// =========================
// DASHBOARD SUMMARY
// =========================

export async function getDashboardSummary() {


  const [

    totalCustomer,

    totalProduct,

    totalTransaction,

    revenue,

  ] = await Promise.all([



    prisma.customer.count(),



    prisma.product.count({

      where: {

        isActive: true,

      },

    }),



    prisma.transaction.count({}),



    prisma.transaction.aggregate({

      _sum: {

        totalAmount: true,

      },


      where: {

        status: "COMPLETED",

      },

    }),


  ]);



  return {


    totalCustomer,


    totalProduct,


    totalTransaction,


    totalRevenue:

      revenue._sum.totalAmount ?? 0,


  };


}

export async function getSalesAnalytics() {


  const transactions =
    await prisma.transaction.findMany({

      where: {

        status: "COMPLETED",

      },


      select: {

        totalAmount: true,

        createdAt: true,

      },


      orderBy: {

        createdAt: "asc",

      },

    });



  const result =
    transactions.reduce(

      (
        acc,
        item
      ) => {


        const date =
          item.createdAt
            .toISOString()
            .slice(0,10);



        const existing =
          acc.find(

            row =>
              row.date === date

          );



        if(existing){


          existing.transaction += 1;


          existing.revenue += Number(
            item.totalAmount
          );


        } else {


          acc.push({

            date,

            transaction: 1,

            revenue:
              Number(item.totalAmount),

          });


        }



        return acc;


      },

      [] as {

        date: string;

        transaction: number;

        revenue: number;

      }[]

    );



  return result;


}

// =========================
// TOP PRODUCTS
// =========================

export async function getTopProducts() {


  const items =
    await prisma.transactionItem.findMany({

      where: {

        transaction: {

          status: "COMPLETED",

        },

      },


      select: {

        quantity: true,

        subtotal: true,


        product: {

          select: {

            id: true,

            sku: true,

            name: true,

          },

        },

      },


    });





  const result =
    items.reduce(

      (acc, item) => {


        const existing =
          acc.find(

            row =>
              row.productId === item.product.id

          );



        if(existing){


          existing.totalSold += item.quantity;


          existing.revenue += Number(
            item.subtotal
          );


        } else {


          acc.push({

            productId:
              item.product.id,


            sku:
              item.product.sku,


            product:
              item.product.name,


            totalSold:
              item.quantity,


            revenue:
              Number(item.subtotal),

          });


        }



        return acc;


      },


      [] as {

        productId: string;

        sku: string;

        product: string;

        totalSold: number;

        revenue: number;

      }[]

    );





  return result.sort(

    (a,b) =>
      b.totalSold - a.totalSold

  );


}

// =========================
// LOW STOCK PRODUCTS
// =========================

export async function getLowStockProducts() {


  return await prisma.product.findMany({

    where: {

      isActive: true,

      stock: {

        lte: 10,

      },

    },


    select: {

      id: true,

      sku: true,

      name: true,

      category: true,

      stock: true,

      price: true,

    },


    orderBy: {

      stock: "asc",

    },

  });


}

// =========================
// CUSTOMER GROWTH
// =========================

export async function getCustomerGrowth() {


  const customers =
    await prisma.customer.findMany({

      select: {

        createdAt: true,

      },


      orderBy: {

        createdAt: "asc",

      },

    });



  const result =
    customers.reduce(

      (
        acc,
        customer
      ) => {


        const month =
          customer.createdAt
            .toISOString()
            .slice(0, 7);



        const existing =
          acc.find(

            item =>
              item.month === month

          );



        if(existing) {


          existing.total += 1;


        } else {


          acc.push({

            month,

            total: 1,

          });


        }



        return acc;


      },


      [] as {

        month: string;

        total: number;

      }[]

    );



  return result;


}





// =========================
// TOP CUSTOMERS
// =========================

export async function getTopCustomers() {


  return await prisma.customer.findMany({

    select: {

      id: true,

      customerCode: true,

      name: true,

      phone: true,

      membership: true,

      totalSpent: true,

    },


    orderBy: {

      totalSpent: "desc",

    },


    take: 10,

  });


}





// =========================
// MEMBERSHIP DISTRIBUTION
// =========================

export async function getMembershipDistribution() {


  const customers =
    await prisma.customer.findMany({

      select: {

        membership: true,

      },

    });



  const result = {


    BRONZE: 0,


    SILVER: 0,


    GOLD: 0,


    PLATINUM: 0,


  };



  customers.forEach(

    customer => {


      result[customer.membership]++;


    }

  );



  return result;


}

// =========================
// LOYALTY ANALYTICS
// =========================

export async function getLoyaltyAnalytics() {


  const [

    totalMember,

    totalPoints,

    earnedPoints,

    rollbackPoints,

  ] = await Promise.all([



    // Total loyalty member

    prisma.loyaltyAccount.count(),





    // Total point aktif

    prisma.loyaltyAccount.aggregate({

      _sum: {

        points: true,

      },

    }),





    // Total point earned

    prisma.loyaltyHistory.aggregate({

      _sum: {

        points: true,

      },


      where: {

        type: "EARN",

      },

    }),





    // Total point rollback

    prisma.loyaltyHistory.aggregate({

      _sum: {

        points: true,

      },


      where: {

        type: "ROLLBACK",

      },

    }),



  ]);




  return {


    totalMember,


    totalPoints:

      totalPoints._sum.points ?? 0,



    earnedPoints:

      earnedPoints._sum.points ?? 0,



    rollbackPoints:

      Math.abs(

        rollbackPoints._sum.points ?? 0

      ),


  };


}

// =========================
// INVENTORY ANALYTICS
// =========================

export async function getInventoryAnalytics() {


  const [

    totalStockIn,

    totalStockOut,

    totalAdjustment,

  ] = await Promise.all([


    prisma.inventoryTransaction.aggregate({

      _sum: {

        quantity: true,

      },


      where: {

        type: "STOCK_IN",

      },

    }),



    prisma.inventoryTransaction.aggregate({

      _sum: {

        quantity: true,

      },


      where: {

        type: "STOCK_OUT",

      },

    }),



    prisma.inventoryTransaction.aggregate({

      _sum: {

        quantity: true,

      },


      where: {

        type: "ADJUSTMENT",

      },

    }),


  ]);



  return {


    totalStockIn:

      totalStockIn._sum.quantity ?? 0,


    totalStockOut:

      totalStockOut._sum.quantity ?? 0,


    totalAdjustment:

      totalAdjustment._sum.quantity ?? 0,


  };


}





// =========================
// INVENTORY HISTORY
// =========================

export async function getInventoryHistory() {


  return await prisma.inventoryTransaction.findMany({


    orderBy: {

      createdAt: "desc",

    },


    select: {


      id: true,


      type: true,


      quantity: true,


      stockBefore: true,


      stockAfter: true,


      description: true,


      createdAt: true,


      product: {


        select: {


          id: true,


          sku: true,


          name: true,


        },


      },


      user: {


        select: {


          id: true,


          name: true,


        },


      },


    },


  });


}