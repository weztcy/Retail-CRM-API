import { prisma } from "@/lib/prisma";

import { InventoryType } from "@/generated/prisma/client";

import type {
  DashboardFilter,
  ProductAnalyticsFilter,
  CustomerAnalyticsFilter,
} from "./dashboard.types";

// =========================
// DASHBOARD SUMMARY
// =========================

export async function getDashboardSummary(filter?: DashboardFilter) {
  const dateFilter = {
    ...(filter?.startDate && {
      gte: filter.startDate,
    }),

    ...(filter?.endDate && {
      lte: filter.endDate,
    }),
  };

  const [totalCustomer, totalProduct, totalTransaction, revenue] =
    await Promise.all([
      prisma.customer.count({
        where: {
          ...(Object.keys(dateFilter).length > 0 && {
            createdAt: dateFilter,
          }),
        },
      }),

      prisma.product.count({
        where: {
          isActive: true,
        },
      }),

      prisma.transaction.count({
        where: {
          ...(Object.keys(dateFilter).length > 0 && {
            createdAt: dateFilter,
          }),
        },
      }),

      prisma.transaction.aggregate({
        _sum: {
          totalAmount: true,
        },

        where: {
          status: "COMPLETED",

          ...(Object.keys(dateFilter).length > 0 && {
            transactionDate: dateFilter,
          }),
        },
      }),
    ]);

  return {
    totalCustomer,

    totalProduct,

    totalTransaction,

    totalRevenue: Number(revenue._sum.totalAmount ?? 0),
  };
}

// =========================
// TOP STOCK OUT PRODUCTS
// =========================

export async function getTopStockOutProducts(
  limit: number = 10,
) {


  const items =

    await prisma.inventoryTransaction.findMany({

      where: {

        type: "STOCK_OUT",

      },


      select: {

        quantity: true,


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





        if (existing) {


          existing.totalOut += item.quantity;


        } else {


          acc.push({

            productId:

              item.product.id,


            sku:

              item.product.sku,


            name:

              item.product.name,


            totalOut:

              item.quantity,


          });


        }



        return acc;


      },


      [] as {

        productId:string;

        sku:string;

        name:string;

        totalOut:number;

      }[]


    );





  return result

    .sort(

      (a,b) =>

        b.totalOut - a.totalOut

    )

    .slice(0, limit);


}

// =========================
// LOW STOCK PRODUCTS
// =========================

export async function getLowStockSummary(){

const [

critical,

low

]=await Promise.all([


prisma.product.count({

where:{

stock:{
 lte:5
},

isActive:true

}

}),



prisma.product.count({

where:{

stock:{
 lte:10
},

isActive:true

}

})


]);


return {

critical,

low

};


}

// =========================
// LOW STOCK ALERT
// =========================

export async function getLowStockProductsDashboard() {


  const [

    critical,

    warning,

    products,

  ] = await Promise.all([



    // stock <= 5

    prisma.product.count({

      where:{

        isActive:true,


        stock:{

          lte:5,

        },

      },

    }),




    // stock <=10

    prisma.product.count({

      where:{

        isActive:true,


        stock:{

          gt:5,

          lte:10,

        },

      },

    }),





    prisma.product.findMany({

      where:{

        isActive:true,


        stock:{

          lte:10,

        },

      },


      select:{

        id:true,

        sku:true,

        name:true,

        category:true,

        stock:true,

        price:true,

      },


      orderBy:{

        stock:"asc",

      },


    }),



  ]);





  return {


    summary:{


      critical,


      warning,


    },



    items:products,


  };


}

// =========================
// CUSTOMER GROWTH
// =========================

export async function getCustomerGrowth() {
  const customers = await prisma.customer.findMany({
    select: {
      createdAt: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  const result = customers.reduce(
    (acc, customer) => {
      const month = customer.createdAt.toISOString().slice(0, 7);

      const existing = acc.find((item) => item.month === month);

      if (existing) {
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
    }[],
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
// LOYALTY ANALYTICS
// =========================

export async function getLoyaltyAnalytics() {
  const [totalMember, totalPoints, earnedPoints, rollbackPoints] =
    await Promise.all([
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

    totalPoints: totalPoints._sum.points ?? 0,

    earnedPoints: earnedPoints._sum.points ?? 0,

    rollbackPoints: Math.abs(rollbackPoints._sum.points ?? 0),
  };
}

// =========================
// INVENTORY ANALYTICS V2
// =========================

export async function getInventoryAnalytics(
  startDate?: Date,
  endDate?: Date,
) {


  const dateFilter = {

    ...(startDate || endDate

      ? {

          createdAt: {

            ...(startDate
              ? {
                  gte: startDate,
                }
              : {}),


            ...(endDate
              ? {
                  lte: endDate,
                }
              : {}),

          },

        }

      : {}),

  };



  const [

    stockIn,

    stockOut,

    adjustment,

    totalTransaction,

    totalQuantityMovement,

  ] = await Promise.all([



    // =========================
    // TOTAL STOCK IN
    // =========================

    prisma.inventoryTransaction.aggregate({

      _sum: {

        quantity: true,

      },


      where: {

        ...dateFilter,


        type: "STOCK_IN",

      },

    }),



    // =========================
    // TOTAL STOCK OUT
    // =========================

    prisma.inventoryTransaction.aggregate({

      _sum: {

        quantity: true,

      },


      where: {

        ...dateFilter,


        type: "STOCK_OUT",

      },

    }),




    // =========================
    // TOTAL ADJUSTMENT
    // =========================

    prisma.inventoryTransaction.aggregate({

      _sum: {

        quantity: true,

      },


      where: {

        ...dateFilter,


        type: "ADJUSTMENT",

      },

    }),




    // =========================
    // TOTAL LOG ACTIVITY
    // =========================

    prisma.inventoryTransaction.count({

      where: dateFilter,

    }),




    // =========================
    // TOTAL QUANTITY MOVEMENT
    // =========================

    prisma.inventoryTransaction.aggregate({

      _sum: {

        quantity: true,

      },


      where: dateFilter,

    }),


  ]);




  return {


    totalStockIn:

      stockIn._sum.quantity ?? 0,



    totalStockOut:

      stockOut._sum.quantity ?? 0,



    totalAdjustment:

      adjustment._sum.quantity ?? 0,



    // jumlah record inventory transaction

    totalTransaction,



    // jumlah seluruh barang bergerak

    totalQuantityMovement:

      totalQuantityMovement._sum.quantity ?? 0,


  };


}

// =========================
// INVENTORY HISTORY
// =========================

export async function getInventoryHistory(
  search?: string,

  type?: InventoryType,

  sort?: string,

  page: number = 1,

  limit: number = 10,
) {
  const skip = (page - 1) * limit;

  const where = {
    ...(type
      ? {
          type,
        }
      : {}),

    ...(search
      ? {
          OR: [
            {
              product: {
                sku: {
                  contains: search,
                },
              },
            },

            {
              product: {
                name: {
                  contains: search,
                },
              },
            },

            {
              user: {
                name: {
                  contains: search,
                },
              },
            },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "oldest"
      ? {
          createdAt: "asc" as const,
        }
      : sort === "quantity_asc"
        ? {
            quantity: "asc" as const,
          }
        : sort === "quantity_desc"
          ? {
              quantity: "desc" as const,
            }
          : {
              createdAt: "desc" as const,
            };

  const [items, total] = await Promise.all([
    prisma.inventoryTransaction.findMany({
      where,

      skip,

      take: limit,

      orderBy,

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
    }),

    prisma.inventoryTransaction.count({
      where,
    }),
  ]);

  return {
    items,

    pagination: {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),
    },
  };
}

// =========================
// INVENTORY MOVEMENT CHART
// =========================

export async function getInventoryMovementChart(
  startDate?: Date,
  endDate?: Date,
) {


  const dateFilter = {

    ...(startDate || endDate

      ? {

          createdAt: {

            ...(startDate
              ? {
                  gte: startDate,
                }
              : {}),


            ...(endDate
              ? {
                  lte: endDate,
                }
              : {}),

          },

        }

      : {}),

  };



  const transactions =
    await prisma.inventoryTransaction.findMany({

      where: dateFilter,


      select: {

        type: true,

        quantity: true,

        createdAt: true,

      },


      orderBy: {

        createdAt: "asc",

      },


    });




  const result =
    transactions.reduce(

      (acc, item) => {


        const date =
          item.createdAt
            .toISOString()
            .slice(0, 10);



        let existing =
          acc.find(

            row =>
              row.date === date

          );



        if (!existing) {


          existing = {

            date,


            stockIn: 0,


            stockOut: 0,


            adjustment: 0,

          };


          acc.push(existing);


        }




        switch(item.type){


          case "STOCK_IN":

            existing.stockIn += item.quantity;

            break;



          case "STOCK_OUT":

            existing.stockOut += item.quantity;

            break;



          case "ADJUSTMENT":

            existing.adjustment += item.quantity;

            break;


        }




        return acc;


      },


      [] as {

        date:string;

        stockIn:number;

        stockOut:number;

        adjustment:number;

      }[]


    );




  return result;


}

// =========================
// SALES ANALYTICS
// =========================

export async function getSalesAnalytics(filter?: DashboardFilter) {
  const dateFilter = {
    ...(filter?.startDate && {
      gte: filter.startDate,
    }),

    ...(filter?.endDate && {
      lte: filter.endDate,
    }),
  };

  const transactions = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",

      ...(Object.keys(dateFilter).length > 0 && {
        transactionDate: dateFilter,
      }),
    },

    select: {
      totalAmount: true,

      transactionDate: true,
    },

    orderBy: {
      transactionDate: "asc",
    },
  });

  const result = transactions.reduce(
    (acc, item) => {
      const date = item.transactionDate.toISOString().slice(0, 10);

      const existing = acc.find((row) => row.date === date);

      if (existing) {
        existing.transaction += 1;

        existing.revenue += Number(item.totalAmount);
      } else {
        acc.push({
          date,

          transaction: 1,

          revenue: Number(item.totalAmount),
        });
      }

      return acc;
    },

    [] as {
      date: string;

      transaction: number;

      revenue: number;
    }[],
  );

  return {
    items: result,

    summary: {
      totalTransaction: result.reduce(
        (sum, item) => sum + item.transaction,

        0,
      ),

      totalRevenue: result.reduce(
        (sum, item) => sum + item.revenue,

        0,
      ),
    },
  };
}

// =========================
// PRODUCT ANALYTICS
// =========================

export async function getProductAnalytics(filter?: ProductAnalyticsFilter) {
  const page = filter?.page ?? 1;

  const limit = filter?.limit ?? 10;

  const skip = (page - 1) * limit;

  const dateFilter = {
    ...(filter?.startDate && {
      gte: filter.startDate,
    }),

    ...(filter?.endDate && {
      lte: filter.endDate,
    }),
  };

  const items = await prisma.transactionItem.findMany({
    where: {
      transaction: {
        status: "COMPLETED",

        ...(Object.keys(dateFilter).length > 0 && {
          transactionDate: dateFilter,
        }),
      },

      ...(filter?.search && {
        product: {
          OR: [
            {
              name: {
                contains: filter.search,
              },
            },

            {
              sku: {
                contains: filter.search,
              },
            },
          ],
        },
      }),
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

  const grouped = items.reduce(
    (acc, item) => {
      const existing = acc.find((row) => row.productId === item.product.id);

      if (existing) {
        existing.totalSold += item.quantity;

        existing.revenue += Number(item.subtotal);
      } else {
        acc.push({
          productId: item.product.id,

          sku: item.product.sku,

          name: item.product.name,

          totalSold: item.quantity,

          revenue: Number(item.subtotal),
        });
      }

      return acc;
    },

    [] as {
      productId: string;

      sku: string;

      name: string;

      totalSold: number;

      revenue: number;
    }[],
  );

  if (filter?.sort === "quantity_asc") {
    grouped.sort((a, b) => a.totalSold - b.totalSold);
  } else if (filter?.sort === "revenue_desc") {
    grouped.sort((a, b) => b.revenue - a.revenue);
  } else if (filter?.sort === "revenue_asc") {
    grouped.sort((a, b) => a.revenue - b.revenue);
  } else {
    grouped.sort((a, b) => b.totalSold - a.totalSold);
  }

  const total = grouped.length;

  return {
    items: grouped.slice(skip, skip + limit),

    pagination: {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),
    },
  };
}

// =========================
// CUSTOMER ANALYTICS
// =========================

export async function getCustomerAnalytics(
 filter?: CustomerAnalyticsFilter
){


 const page =
   filter?.page ?? 1;


 const limit =
   filter?.limit ?? 10;


 const skip =
   (page - 1) * limit;



 const dateFilter = {


   ...(filter?.startDate && {

     gte:
       filter.startDate,

   }),


   ...(filter?.endDate && {

     lte:
       filter.endDate,

   }),


 };





 const where = {


   ...(filter?.membership && {

     membership:
       filter.membership,

   }),



   ...(filter?.search && {


     OR:[


       {

        name:{
          contains:
            filter.search,
        },

       },


       {

        phone:{
          contains:
            filter.search,
        },

       },


       {

        customerCode:{
          contains:
            filter.search,
        },

       },


     ],


   }),



   ...(Object.keys(dateFilter).length > 0 && {


      createdAt:
        dateFilter,


   }),


 };





 const [

  customers,

  total,

  totalCustomer,

  activeCustomer,

 ] = await Promise.all([



   prisma.customer.findMany({


    where,


    skip,


    take:limit,


    orderBy:

      filter?.sort === "spent_asc"

      ?

      {
        totalSpent:"asc"
      }

      :

      filter?.sort === "latest"

      ?

      {
        createdAt:"desc"
      }

      :

      {
        totalSpent:"desc"
      },


    select:{


      id:true,

      customerCode:true,

      name:true,

      phone:true,

      membership:true,

      totalSpent:true,

      createdAt:true,


    },


   }),




   prisma.customer.count({

    where,

   }),





   prisma.customer.count(),





   prisma.customer.count({

    where:{
      isActive:true
    }

   }),



 ]);





 const membership =
 {

   BRONZE:0,

   SILVER:0,

   GOLD:0,

   PLATINUM:0,

 };




 const memberships =
   await prisma.customer.findMany({

    select:{
      membership:true
    }

   });




 memberships.forEach(
  item=>{

   membership[item.membership]++;

  }
 );





 return {


  summary:{


   totalCustomer,


   activeCustomer,


  },


  membership,



  items:customers,



  pagination:{


    page,

    limit,

    total,

    totalPages:
      Math.ceil(total/limit),


  },


 };


}

// =========================
// STOCK VALUE SUMMARY
// =========================

// =========================
// STOCK VALUE SUMMARY
// =========================

export async function getStockValueSummary() {


  const products = await prisma.product.findMany({

    where: {

      isActive: true,

    },


    select: {

      stock: true,

      price: true,

    },

  });



  let totalStock = 0;

  let inventoryValue = 0;



  for (const product of products) {


    const stock = product.stock;


    const price = Number(product.price);



    totalStock += stock;


    inventoryValue += stock * price;


  }




  return {

    totalProduct: products.length,


    totalStock,


    inventoryValue,


  };

}