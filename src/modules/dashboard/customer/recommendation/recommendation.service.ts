import { prisma } from "@/lib/prisma";


import type {
  CustomerRecommendation,
} from "./recommendation.types";




// =========================
// GET CUSTOMER RECOMMENDATION
// =========================

export async function getCustomerRecommendation(

  customerId:string

):Promise<CustomerRecommendation>{



  // =========================
  // GET CUSTOMER PURCHASE
  // =========================

  const purchasedItems =

    await prisma.transactionItem.findMany({

      where:{


        transaction:{


          customerId,


          status:"COMPLETED",


        },


      },


      select:{


        productId:true,


        product:{


          select:{


            category:true,


          },


        },


      },


    });







  if(!purchasedItems.length){


    const products =

      await prisma.product.findMany({

        where:{

          isActive:true,

        },


        orderBy:{

          stock:"desc",

        },


        take:10,


        select:{


          id:true,

          name:true,

          category:true,

          price:true,


        },


      });





    return {


      recommendations:

        products.map(product=>({


          productId:product.id,


          productName:product.name,


          category:product.category,


          price:Number(product.price),


          reason:

          "Produk populer untuk customer baru",



        })),



    };


  }








  // =========================
  // FAVORITE CATEGORY
  // =========================


  const categoryMap =

    new Map<string,number>();




  purchasedItems.forEach(item=>{


    const category =

      item.product.category;




    categoryMap.set(

      category,

      (

        categoryMap.get(category)

        ??

        0

      ) + 1

    );


  });






  const favoriteCategory =

    Array.from(

      categoryMap.entries()

    )

    .sort(

      (a,b)=>

      b[1]-a[1]

    )[0][0];








  // =========================
  // EXISTING PRODUCTS
  // =========================


  const purchasedProductIds =

    purchasedItems.map(

      item => item.productId

    );








  // =========================
  // RECOMMEND PRODUCT
  // =========================


  const products =

    await prisma.product.findMany({

      where:{


        isActive:true,


        category:

          favoriteCategory,


        id:{

          notIn:

            purchasedProductIds,

        },


      },


      orderBy:{


        stock:"desc",


      },


      take:10,


      select:{


        id:true,

        name:true,

        category:true,

        price:true,


      },


    });









  return {


    recommendations:


      products.map(product=>({


        productId:

          product.id,


        productName:

          product.name,


        category:

          product.category,


        price:

          Number(product.price),



        reason:


          `Karena Anda sering membeli kategori ${favoriteCategory}`,



      })),


  };



}