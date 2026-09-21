import { prisma } from "@/lib/prisma";

import {
  createAuditLog,
} from "@/modules/audit/audit.service";

import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "./customer.types";

import {
  ApiError,
} from "@/utils/errors/api-error";

// =========================
// GET ALL CUSTOMERS
// =========================

export async function getCustomers() {

  return await prisma.customer.findMany({

    select: {

      id: true,

      customerCode: true,

      name: true,

      phone: true,

      email: true,

      gender: true,

      city: true,

      membership: true,

      totalSpent: true,

      createdAt: true,

      updatedAt: true,

    },


    orderBy: {

      createdAt: "desc",

    },

  });

}



// =========================
// GET CUSTOMER BY ID
// =========================

export async function getCustomerById(
  id: string
) {

  return await prisma.customer.findUnique({

    where: {

      id,

    },


    select: {

      id: true,

      customerCode: true,

      name: true,

      phone: true,

      email: true,

      gender: true,

      birthDate: true,

      address: true,

      city: true,

      membership: true,

      totalSpent: true,

      createdAt: true,

      updatedAt: true,

    },

  });

}



// =========================
// CREATE CUSTOMER
// =========================

export async function createCustomer(
  data: CreateCustomerInput,
  userId: string
) {


  const customer =

    await prisma.customer.create({

      data: {

        customerCode:
          data.customerCode,


        name:
          data.name,


        phone:
          data.phone,


        email:
          data.email,


        gender:
          data.gender,


        birthDate:

          data.birthDate

            ? new Date(data.birthDate)

            : undefined,


        address:
          data.address,


        city:
          data.city,



        // =========================
        // CREATE LOYALTY ACCOUNT
        // =========================

        loyalty: {

          create: {

            points: 0,

          },

        },


      },


      select: {

        id: true,

        customerCode: true,

        name: true,

        phone: true,

        email: true,

        membership: true,

        totalSpent: true,

        createdAt: true,


        loyalty: {

          select: {

            points: true,

          },

        },

      },


    });




  // =========================
  // CREATE AUDIT LOG
  // =========================

  await createAuditLog({

    userId,


    action:
      "CREATE",


    module:
      "CUSTOMER",


    description:

      `Membuat customer ${customer.customerCode}`,


  });




  return customer;


}



// =========================
// UPDATE CUSTOMER
// =========================

export async function updateCustomer(
  id: string,
  data: UpdateCustomerInput,
  userId: string
) {


  const customer =
    await prisma.customer.findUnique({

      where: {

        id,

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





  const updatedCustomer =
    await prisma.customer.update({

      where: {

        id,

      },


      data: {

        name:
          data.name,


        phone:
          data.phone,


        email:
          data.email,


        gender:
          data.gender,


        birthDate:

          data.birthDate

            ? new Date(data.birthDate)

            : undefined,


        address:
          data.address,


        city:
          data.city,


        membership:
          data.membership,

      },


      select: {

        id: true,

        customerCode: true,

        name: true,

        phone: true,

        email: true,

        membership: true,

        updatedAt: true,

      },

    });






  // =========================
  // CREATE AUDIT LOG
  // =========================

  await createAuditLog({

    userId,


    action:

      "UPDATE",


    module:

      "CUSTOMER",


    description:

      `Mengubah data customer ${customer.customerCode}`,

  });






  return updatedCustomer;


}


// =========================
// DELETE CUSTOMER (SOFT)
// =========================

export async function deleteCustomer(
  id: string
) {


  return await prisma.customer.update({

    where: {

      id,

    },


    data: {

      membership: "BRONZE",

    },


    select: {

      id: true,

      name: true,

      phone: true,

    },

  });

}

// =========================
// GET CUSTOMERS BY MEMBERSHIP
// =========================

export async function getCustomersByMembership(
  membership:
    | "BRONZE"
    | "SILVER"
    | "GOLD"
    | "PLATINUM"
) {


  return await prisma.customer.findMany({

    where: {

      membership,

    },


    select: {

      id: true,

      customerCode: true,

      name: true,

      phone: true,

      membership: true,

      totalSpent: true,

    },


    orderBy: {

      totalSpent: "desc",

    },

  });

}

// =========================
// CUSTOMER PURCHASE HISTORY
// =========================

export async function getCustomerTransactions(
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




  const transactions =
    await prisma.transaction.findMany({

      where: {

        customerId,

      },


      orderBy: {

        createdAt: "desc",

      },


      include: {

        items: {

          include: {

            product: {

              select: {

                id: true,

                sku: true,

                name: true,

              },

            },

          },

        },

      },

    });





  const completedTransactions =
    transactions.filter(

      transaction =>

        transaction.status === "COMPLETED"

    );





  const totalSpent =
    completedTransactions.reduce(

      (total, transaction) =>

        total + Number(transaction.totalAmount),

      0

    );





  return {


    customer,


    summary: {

      totalTransaction:
        transactions.length,


      totalSpent,


    },


    transactions,


  };


}