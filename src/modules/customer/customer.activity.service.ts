import { prisma } from "@/lib/prisma";

import {
  createAuditLog,
} from "@/modules/audit/audit.service";

import {
  ApiError,
} from "@/utils/errors/api-error";

import type {
  CreateCustomerActivityInput,
} from "./customer.activity.types";


// =========================
// CREATE CUSTOMER ACTIVITY
// =========================

export async function createCustomerActivity(

  customerId: string,

  data: CreateCustomerActivityInput,

  userId: string

) {


  const customer =

    await prisma.customer.findUnique({

      where: {

        id: customerId,

      },


      select: {

        id: true,

        customerCode: true,

      },

    });




  if (!customer) {

    throw new ApiError(

      "Customer tidak ditemukan",

      404

    );

  }




  const activity =

    await prisma.customerActivity.create({

      data: {


        customerId,


        userId,


        type: data.type,


        subject: data.subject,


        description: data.description,


        status: data.status ?? "PENDING",


      },


    });





  await createAuditLog({

    userId,


    action: "CREATE",


    module: "CUSTOMER_ACTIVITY",


    description:

      `Membuat activity customer ${customer.customerCode}`,

  });





  return activity;


}




// =========================
// GET CUSTOMER ACTIVITIES
// =========================

export async function getCustomerActivities(

  customerId: string

) {


  const customer =

    await prisma.customer.findUnique({

      where: {

        id: customerId,

      },


      select: {

        id: true,

        customerCode: true,

        name: true,

      },

    });




  if (!customer) {

    throw new ApiError(

      "Customer tidak ditemukan",

      404

    );

  }




  return await prisma.customerActivity.findMany({

    where: {

      customerId,

    },


    orderBy: {

      createdAt: "desc",

    },


    include: {


      user: {

        select: {

          id: true,

          name: true,

        },

      },

    },

  });


}