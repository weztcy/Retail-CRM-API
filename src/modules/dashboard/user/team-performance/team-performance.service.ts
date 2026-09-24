import { prisma } from "@/lib/prisma";


import type {
  TeamPerformanceDashboard,
} from "./team-performance.types";




// =========================
// GET TEAM PERFORMANCE
// =========================

export async function getTeamPerformanceDashboard()

:Promise<TeamPerformanceDashboard>{





  // =========================
  // GET STAFF PERFORMANCE
  // =========================

  const users =

    await prisma.user.findMany({

      where: {

        isActive:true,

        role: {

          in:[

            "SALES",

            "MANAGER",

            "ADMIN",

            "SUPER_ADMIN",

          ],

        },

      },


      select:{


        id:true,


        name:true,


        role:true,



        transactions:{


          where:{


            status:"COMPLETED",


          },


          select:{


            totalAmount:true,


            customerId:true,


            items:{


              select:{


                quantity:true,


                product:{


                  select:{


                    name:true,


                  },


                },


              },


            },


          },


        },


      },


    });







  const ranking = users.map(user=>{


    const transaction =

      user.transactions.length;




    const revenue =

      user.transactions.reduce(

        (sum,item)=>

          sum +

          Number(item.totalAmount),

        0

      );





    const customer =

      new Set(

        user.transactions.map(

          trx => trx.customerId

        )

      ).size;






    return {


      userId:user.id,


      name:user.name,


      role:user.role,


      transaction,


      revenue,


      customer,


    };



  })

  .sort(

    (a,b)=>

      b.revenue -

      a.revenue

  );









  // =========================
  // OVERVIEW
  // =========================


  const totalStaff =

    users.length;




  const totalRevenue =

    ranking.reduce(

      (sum,user)=>

        sum +

        user.revenue,

      0

    );





  const totalTransaction =

    ranking.reduce(

      (sum,user)=>

        sum +

        user.transaction,

      0

    );







  const averageRevenue =

    totalStaff > 0

    ?

    totalRevenue /

    totalStaff

    :

    0;









  // =========================
  // TOP PRODUCT PER TEAM
  // =========================


  const productMap =

    new Map<

      string,

      {

        userName:string;

        quantity:number;

      }

    >();







  users.forEach(user=>{


    user.transactions.forEach(trx=>{


      trx.items.forEach(item=>{


        const key =

          `${user.name}-${item.product.name}`;





        const current =

          productMap.get(key);





        productMap.set(

          key,

          {

            userName:user.name,


            quantity:

              (

                current?.quantity

                ??

                0

              )

              +

              item.quantity,

          }

        );


      });


    });


  });








  const topProducts =

    Array.from(

      productMap.entries()

    )

    .map(([key,value])=>{


      const productName =

        key.split("-")[1];



      return {


        userName:value.userName,


        productName,


        quantity:value.quantity,


      };


    })

    .sort(

      (a,b)=>

        b.quantity -

        a.quantity

    )

    .slice(

      0,

      10

    );








  return {


    overview:{


      totalStaff,


      totalRevenue,


      totalTransaction,


      averageRevenue,


    },



    ranking,



    topProducts,


  };



}