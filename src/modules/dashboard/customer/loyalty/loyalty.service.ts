import { prisma } from "@/lib/prisma";


import type {
  CustomerLoyaltyDashboard,
} from "./loyalty.types";




// =========================
// GET CUSTOMER LOYALTY DASHBOARD
// =========================

export async function getCustomerLoyaltyDashboard(

  customerId:string

):Promise<CustomerLoyaltyDashboard>{



  const customer =

    await prisma.customer.findUnique({

      where:{

        id:customerId,

      },


      select:{


        membership:true,


        loyalty:{


          select:{


            points:true,


            histories:{


              orderBy:{


                createdAt:"desc",


              },


              select:{


                type:true,


                points:true,


                description:true,


                createdAt:true,


              },


            },


          },


        },


      },


    });






  if(!customer){

    throw new Error(

      "Customer tidak ditemukan"

    );

  }






  const histories =

    customer.loyalty?.histories ?? [];





  const totalEarned =

    histories


      .filter(

        item =>

        item.type === "EARN"

      )


      .reduce(

        (sum,item)=>

          sum + item.points,

        0

      );






  const totalRollback =

    histories


      .filter(

        item =>

        item.type === "ROLLBACK"

      )


      .reduce(

        (sum,item)=>

          sum + item.points,

        0

      );







  // =========================
  // MEMBERSHIP PROGRESS
  // =========================


  let nextMembership:null|string = null;

  let progress = 100;



  if(customer.membership === "BRONZE"){


    nextMembership = "SILVER";

    progress = 25;


  }


  else if(customer.membership === "SILVER"){


    nextMembership = "GOLD";

    progress = 50;


  }


  else if(customer.membership === "GOLD"){


    nextMembership = "PLATINUM";

    progress = 75;


  }








  return {


    overview:{


      points:

        customer.loyalty?.points ?? 0,


      totalEarned,


      totalRollback,


    },





    membership:{


      current:

        customer.membership,


      next:

        nextMembership,


      progress,


    },





    history:


      histories.map(item=>({


        type:item.type,


        points:item.points,


        description:item.description,


        date:item.createdAt,


      })),


  };


}