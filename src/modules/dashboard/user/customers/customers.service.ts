import { prisma } from "@/lib/prisma";


import type {
  UserDashboardCustomers,
} from "./customers.types";




// =========================
// GET USER CUSTOMER DASHBOARD
// =========================

export async function getUserDashboardCustomers()

:Promise<UserDashboardCustomers>{



  const now = new Date();



  const startMonth =

    new Date(

      now.getFullYear(),

      now.getMonth(),

      1

    );



  const startYear =

    new Date(

      now.getFullYear(),

      now.getMonth() - 11,

      1

    );






  const [

    totalCustomer,

    activeCustomer,

    inactiveCustomer,

    newCustomerThisMonth,

    membershipData,

    customerGrowth,

    transactions,


  ] = await Promise.all([





    // =========================
    // CUSTOMER OVERVIEW
    // =========================


    prisma.customer.count(),



    prisma.customer.count({

      where:{

        isActive:true,

      },

    }),



    prisma.customer.count({

      where:{

        isActive:false,

      },

    }),



    prisma.customer.count({

      where:{

        createdAt:{

          gte:startMonth,

        },

      },

    }),





    // =========================
    // MEMBERSHIP DISTRIBUTION
    // =========================


    prisma.customer.groupBy({

      by:[

        "membership",

      ],


      _count:{

        id:true,

      },


    }),






    // =========================
    // CUSTOMER GROWTH
    // =========================


    prisma.customer.findMany({

      where:{

        createdAt:{

          gte:startYear,

        },

      },


      select:{

        createdAt:true,

      },

    }),






    // =========================
    // TOP CUSTOMER
    // =========================


    prisma.transaction.findMany({

      where:{

        status:"COMPLETED",

        paymentStatus:"PAID",

      },


      select:{

        totalAmount:true,


        customer:{

          select:{

            id:true,

            name:true,

          },

        },

      },


    }),



  ]);








  // =========================
  // PROCESS GROWTH
  // =========================


  const growthMap =

    new Map<string,number>();




  customerGrowth.forEach((item)=>{


    const key =

      item.createdAt.toLocaleString(

        "en-US",

        {

          month:"short",

          year:"numeric",

        }

      );



    growthMap.set(

      key,

      (growthMap.get(key) ?? 0) + 1

    );


  });








  // =========================
  // PROCESS TOP CUSTOMER
  // =========================


  const customerMap =

    new Map<string,{

      customerId:string;

      name:string;

      totalSpent:number;

      transactionCount:number;

    }>();





  transactions.forEach((item)=>{


    const id =

      item.customer.id;




    const current =

      customerMap.get(id)

      ??

      {

        customerId:id,

        name:item.customer.name,

        totalSpent:0,

        transactionCount:0,

      };




    current.totalSpent +=

      Number(item.totalAmount);




    current.transactionCount += 1;



    customerMap.set(

      id,

      current

    );



  });








  return {



    overview:{


      total:

        totalCustomer,


      active:

        activeCustomer,


      inactive:

        inactiveCustomer,


      newThisMonth:

        newCustomerThisMonth,


    },





    membership:

      membershipData.map((item)=>({


        level:item.membership,


        total:item._count.id,


      })),






    growth:


      Array.from(

        growthMap.entries()

      )

      .map(([month,total])=>({


        month,


        total,


      })),







    topCustomers:


      Array.from(

        customerMap.values()

      )

      .sort(

        (a,b)=>

          b.totalSpent -

          a.totalSpent

      )

      .slice(0,10),




  };



}