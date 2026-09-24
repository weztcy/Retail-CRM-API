import { prisma } from "@/lib/prisma";


import type {
  CustomerTransactionHistory,
} from "./transaction.types";




// =========================
// GET CUSTOMER TRANSACTION HISTORY
// =========================

export async function getCustomerTransactionHistory(

  customerId:string

):Promise<CustomerTransactionHistory>{



  const transactions =

    await prisma.transaction.findMany({

      where:{

        customerId,

      },


      orderBy:{

        transactionDate:"desc",

      },


      select:{


        id:true,


        invoiceNumber:true,


        transactionDate:true,


        totalAmount:true,


        paymentMethod:true,


        paymentStatus:true,


        status:true,



        items:{


          select:{


            productId:true,


            quantity:true,


            price:true,


            subtotal:true,



            product:{


              select:{


                name:true,


              },


            },


          },


        },


      },


    });









  const totalTransaction =

    transactions.length;





  const totalSpent =

    transactions.reduce(

      (sum,item)=>

        sum +

        Number(item.totalAmount),

      0

    );









  return {


    summary:{


      totalTransaction,


      totalSpent,


    },






    transactions:


      transactions.map((transaction)=>({


        id:transaction.id,


        invoiceNumber:

          transaction.invoiceNumber,



        transactionDate:

          transaction.transactionDate,



        totalAmount:

          Number(transaction.totalAmount),



        paymentMethod:

          transaction.paymentMethod,



        paymentStatus:

          transaction.paymentStatus,



        status:

          transaction.status,





        items:


          transaction.items.map((item)=>({



            productId:

              item.productId,



            productName:

              item.product.name,



            quantity:

              item.quantity,



            price:

              Number(item.price),



            subtotal:

              Number(item.subtotal),



          })),



      })),



  };


}