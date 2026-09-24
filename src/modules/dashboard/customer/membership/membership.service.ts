import { prisma } from "@/lib/prisma";


import type {
  CustomerMembershipDashboard,
} from "./membership.types";




// =========================
// GET CUSTOMER MEMBERSHIP STATUS
// =========================

export async function getCustomerMembershipStatus(

  customerId:string

):Promise<CustomerMembershipDashboard>{



  const customer =

    await prisma.customer.findUnique({

      where:{

        id:customerId,

      },


      select:{


        membership:true,


        totalSpent:true,


      },


    });





  if(!customer){

    throw new Error(

      "Customer tidak ditemukan"

    );

  }







  let nextLevel:string|null = null;


  let targetSpent = Number(customer.totalSpent);



  let benefits:string[] = [];





  switch(customer.membership){


    case "BRONZE":

      nextLevel = "SILVER";

      targetSpent = 5000000;


      benefits=[

        "Member Bronze",

        "Promo reguler",

      ];

      break;





    case "SILVER":

      nextLevel="GOLD";

      targetSpent=15000000;


      benefits=[

        "Diskon member 5%",

        "Promo khusus member",

      ];

      break;





    case "GOLD":

      nextLevel="PLATINUM";

      targetSpent=30000000;


      benefits=[

        "Diskon member 10%",

        "Prioritas promo",

      ];

      break;





    case "PLATINUM":

      nextLevel=null;

      targetSpent=Number(customer.totalSpent);


      benefits=[

        "Diskon member 15%",

        "VIP customer",

        "Prioritas layanan",

      ];

      break;



  }








  const currentSpent =

    Number(customer.totalSpent);






  const percentage =


    targetSpent > 0

    ?

    Math.min(

      Math.round(

        (

          currentSpent /

          targetSpent

        )

        *

        100

      ),

      100

    )

    :

    100;







  return {


    currentLevel:

      customer.membership,





    nextLevel,





    progress:{


      currentSpent,


      targetSpent,



      remaining:

        Math.max(

          targetSpent -

          currentSpent,

          0

        ),



      percentage,


    },





    benefits,


  };



}