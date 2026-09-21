import { prisma } from "@/lib/prisma";




// =========================
// CUSTOMER SEGMENTATION
// =========================

export async function getCustomerSegments() {


  const customers =
    await prisma.customer.findMany({

      select: {

        id: true,

        customerCode: true,

        name: true,

        totalSpent: true,

        membership: true,

      },


      orderBy: {

        totalSpent: "desc",

      },

    });





  return customers.map(

    customer => ({


      id:
        customer.id,


      customerCode:
        customer.customerCode,


      name:
        customer.name,


      membership:
        customer.membership,


      totalSpent:
        Number(customer.totalSpent),


      segment:
        calculateSegment(

          Number(customer.totalSpent)

        ),


    })

  );


}





// =========================
// CALCULATE SEGMENT
// =========================

function calculateSegment(

  totalSpent: number

) {


  if (

    totalSpent === 0

  ) {


    return "NEW";


  }



  if (

    totalSpent < 1000000

  ) {


    return "BRONZE";


  }



  if (

    totalSpent < 5000000

  ) {


    return "SILVER";


  }



  if (

    totalSpent < 10000000

  ) {


    return "GOLD";


  }



  return "PLATINUM";


}

// =========================
// CUSTOMER SEGMENT SUMMARY
// =========================

export async function getCustomerSegmentSummary() {


  const customers =
    await prisma.customer.findMany({

      select: {

        totalSpent: true,

      },

    });



  const summary = {


    NEW: 0,


    BRONZE: 0,


    SILVER: 0,


    GOLD: 0,


    PLATINUM: 0,


  };




  for (const customer of customers) {


    const segment =
      calculateSegment(

        Number(customer.totalSpent)

      );



    summary[segment]++;


  }




  return {


    totalCustomer:

      customers.length,



    summary:

      Object.entries(summary)

      .map(

        ([segment, count]) => ({

          segment,

          count,

        })

      ),


  };


}