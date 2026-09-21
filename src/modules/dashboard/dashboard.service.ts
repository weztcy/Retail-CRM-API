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