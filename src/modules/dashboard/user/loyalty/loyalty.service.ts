import { prisma } from "@/lib/prisma";


import type {
  UserDashboardLoyalty,
} from "./loyalty.types";




// =========================
// GET USER LOYALTY DASHBOARD
// =========================

export async function getUserDashboardLoyalty()

:Promise<UserDashboardLoyalty>{



  const now = new Date();



  const startYear =

    new Date(

      now.getFullYear(),

      now.getMonth() - 11,

      1

    );




  const [


    totalMember,


    activeMember,


    loyaltyAccounts,


    history,


    topCustomers,


    trendData,


  ] = await Promise.all([





    // =========================
    // TOTAL LOYALTY MEMBER
    // =========================


    prisma.loyaltyAccount.count(),






    // =========================
    // ACTIVE MEMBER
    // =========================


    prisma.loyaltyAccount.count({

      where:{

        customer:{

          isActive:true,

        },

      },

    }),






    // =========================
    // POINT SUMMARY
    // =========================


    prisma.loyaltyAccount.findMany({

      select:{

        points:true,

      },

    }),






    // =========================
    // POINT ACTIVITY
    // =========================


    prisma.loyaltyHistory.findMany({

      select:{

        type:true,

        points:true,

      },

    }),






    // =========================
    // TOP LOYALTY CUSTOMER
    // =========================


    prisma.loyaltyAccount.findMany({

      take:10,


      orderBy:{

        points:"desc",

      },


      select:{


        points:true,


        customer:{

          select:{

            id:true,

            name:true,

            membership:true,

          },

        },


      },


    }),






    // =========================
    // LOYALTY TREND
    // =========================


    prisma.loyaltyHistory.findMany({

      where:{

        createdAt:{

          gte:startYear,

        },

      },


      select:{

        points:true,

        createdAt:true,

        type:true,

      },


    }),





  ]);









  // =========================
  // TOTAL POINT
  // =========================


  const totalPoints =

    loyaltyAccounts.reduce(

      (total,item)=>

        total + item.points,

      0

    );









  // =========================
  // AVERAGE POINT
  // =========================


  const averagePoints =

    totalMember > 0

      ?

      totalPoints / totalMember

      :

      0;









  // =========================
  // POINT ACTIVITY PROCESS
  // =========================


  const activityMap =

    new Map<string,{

      totalPoints:number;

      totalTransaction:number;

    }>();




  history.forEach((item)=>{


    const current =

      activityMap.get(item.type)

      ??

      {

        totalPoints:0,

        totalTransaction:0,

      };




    current.totalPoints += item.points;


    current.totalTransaction += 1;




    activityMap.set(

      item.type,

      current

    );


  });









  // =========================
  // TREND PROCESS
  // =========================


  const trendMap =

    new Map<string,number>();




  trendData.forEach((item)=>{


    const month =

      item.createdAt.toLocaleString(

        "en-US",

        {

          month:"short",

          year:"numeric",

        }

      );




    const value =

      item.type === "ROLLBACK"

      ?

      -item.points

      :

      item.points;




    trendMap.set(

      month,

      (

        trendMap.get(month)

        ??

        0

      )

      +

      value

    );



  });









  return {


    overview:{


      totalMember,


      totalPoints,


      averagePoints,


      activeMember,


    },





    pointActivity:


      Array.from(

        activityMap.entries()

      )

      .map(([type,value])=>({


        type,

        ...value,


      })),






    topCustomers:


      topCustomers.map((item)=>({


        customerId:item.customer.id,


        customerName:item.customer.name,


        membership:item.customer.membership,


        points:item.points,


      })),






    trend:


      Array.from(

        trendMap.entries()

      )

      .map(([month,points])=>({


        month,

        points,


      })),



  };


}