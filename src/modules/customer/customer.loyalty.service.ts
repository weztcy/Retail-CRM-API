import { prisma } from "@/lib/prisma";

import {
  ApiError,
} from "@/utils/errors/api-error";



// =========================
// GET CUSTOMER LOYALTY
// =========================

export async function getCustomerLoyalty(
  customerId: string
) {


  const customer =
    await prisma.customer.findUnique({

      where: {

        id: customerId,

      },


      select: {

        id: true,

        name: true,


        loyalty: {

          select: {

            points: true,

          },

        },

      },

    });



  if (!customer) {


    throw new ApiError(

      "Customer tidak ditemukan",

      404

    );


  }




  return {


    customerId:

      customer.id,


    customer:

      customer.name,


    points:

      customer.loyalty?.points ?? 0,


  };


}