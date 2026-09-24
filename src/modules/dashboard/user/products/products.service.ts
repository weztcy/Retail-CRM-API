import { prisma } from "@/lib/prisma";


import type {
  UserDashboardProducts,
} from "./products.types";




// =========================
// GET USER PRODUCT DASHBOARD
// =========================

export async function getUserDashboardProducts()

:Promise<UserDashboardProducts>{





  const [


    totalProduct,


    activeProduct,


    inactiveProduct,


    lowStockProduct,


    categoryData,


    transactionItems,


    products,



  ] = await Promise.all([





    // =========================
    // PRODUCT OVERVIEW
    // =========================


    prisma.product.count(),






    prisma.product.count({

      where:{

        isActive:true,

      },

    }),





    prisma.product.count({

      where:{

        isActive:false,

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
    // CATEGORY DISTRIBUTION
    // =========================


    prisma.product.groupBy({

      by:[

        "category",

      ],


      _count:{

        id:true,

      },

    }),







    // =========================
    // SELLING DATA
    // =========================


    prisma.transactionItem.findMany({

      where:{


        transaction:{

          status:"COMPLETED",

          paymentStatus:"PAID",

        },


      },


      select:{


        quantity:true,


        subtotal:true,


        product:{

          select:{

            id:true,

            name:true,

            stock:true,

          },

        },


      },


    }),





    // =========================
    // ALL PRODUCT
    // =========================


    prisma.product.findMany({

      where:{

        isActive:true,

      },


      select:{


        id:true,

        name:true,

        stock:true,


      },


    }),




  ]);









  // =========================
  // PROCESS SELLING PRODUCT
  // =========================


  const productMap =

    new Map<string,{

      productId:string;

      name:string;

      quantity:number;

      revenue:number;

    }>();





  transactionItems.forEach((item)=>{


    const id =

      item.product.id;




    const current =

      productMap.get(id)

      ??

      {

        productId:id,

        name:item.product.name,

        quantity:0,

        revenue:0,

      };




    current.quantity +=

      item.quantity;




    current.revenue +=

      Number(item.subtotal);





    productMap.set(

      id,

      current

    );



  });







  const topSellingProducts =


    Array.from(

      productMap.values()

    )

    .sort(

      (a,b)=>

        b.quantity -

        a.quantity

    )

    .slice(0,10);








  // =========================
  // PROCESS SLOW MOVING
  // =========================


  const slowMovingProducts =


    products

    .map((product)=>{


      const sold =

        productMap.get(product.id);



      return {


        productId:

          product.id,


        name:

          product.name,


        stock:

          product.stock,


        soldQuantity:

          sold?.quantity ?? 0,


      };


    })

    .filter(

      product =>

        product.soldQuantity === 0

    )

    .slice(0,10);








  return {


    overview:{


      total:

        totalProduct,


      active:

        activeProduct,


      inactive:

        inactiveProduct,


      lowStock:

        lowStockProduct,


    },





    categoryDistribution:


      categoryData.map((item)=>({


        category:

          item.category,


        total:

          item._count.id,


      })),






    topSellingProducts,





    slowMovingProducts,



  };



}