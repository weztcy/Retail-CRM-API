import { prisma } from "@/lib/prisma";


import type {
  UserDashboardAudit,
} from "./audit.types";




// =========================
// GET USER AUDIT DASHBOARD
// =========================

export async function getUserDashboardAudit()

:Promise<UserDashboardAudit>{



  const today = new Date();


  today.setHours(
    0,
    0,
    0,
    0
  );





  const [

    totalActivity,

    todayActivity,

    moduleData,

    actionData,

    recentActivity,

    activeUser,

  ] = await Promise.all([





    // =========================
    // TOTAL ACTIVITY
    // =========================

    prisma.auditLog.count(),






    // =========================
    // TODAY ACTIVITY
    // =========================

    prisma.auditLog.count({

      where:{

        createdAt:{

          gte:today,

        },

      },

    }),






    // =========================
    // MODULE ACTIVITY
    // =========================

    prisma.auditLog.groupBy({

      by:[

        "module",

      ],

      _count:{

        id:true,

      },

    }),







    // =========================
    // ACTION ACTIVITY
    // =========================

    prisma.auditLog.groupBy({

      by:[

        "action",

      ],

      _count:{

        id:true,

      },

    }),







    // =========================
    // RECENT ACTIVITY
    // =========================

    prisma.auditLog.findMany({

      take:10,


      orderBy:{

        createdAt:"desc",

      },


      select:{

        id:true,

        module:true,

        action:true,

        description:true,

        createdAt:true,


        user:{

          select:{

            name:true,

          },

        },

      },

    }),







    // =========================
    // ACTIVE USER
    // =========================

    prisma.user.count({

      where:{

        isActive:true,

      },

    }),




  ]);








  return {


    overview:{


      totalActivity,


      todayActivity,


      activeUser,


    },







    moduleActivity:


      moduleData.map((item)=>({


        module:item.module,


        total:item._count.id,


      })),







    actionActivity:


      actionData.map((item)=>({


        action:item.action,


        total:item._count.id,


      })),







    recentActivity:


      recentActivity.map((item)=>({


        id:item.id,


        userName:item.user.name,


        module:item.module,


        action:item.action,


        description:item.description,


        createdAt:item.createdAt,


      })),



  };

}