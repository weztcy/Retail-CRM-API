import { prisma } from "@/lib/prisma";


import {
  hashPassword,
} from "@/modules/auth/auth.utils";


import type {
  CreateUserInput,
  UpdateUserInput,
} from "./user.types";

import {
  createAuditLog,
} from "@/modules/audit/audit.service";

// =========================
// GET ALL USERS
// =========================

export async function getUsers() {

  return await prisma.user.findMany({

    select: {

      id: true,

      name: true,

      email: true,

      role: true,

      isActive: true,

      createdAt: true,

      updatedAt: true,

    },


    orderBy: {

      createdAt: "desc",

    },

  });

}



// =========================
// GET USER BY ID
// =========================

export async function getUserById(
  id: string
) {

  return await prisma.user.findUnique({

    where: {
      id,
    },


    select: {

      id: true,

      name: true,

      email: true,

      role: true,

      isActive: true,

      createdAt: true,

      updatedAt: true,

    },

  });

}



// =========================
// CREATE USER
// =========================

export async function createUser(
  data: CreateUserInput,
  userId: string
) {


  const passwordHash =
    await hashPassword(
      data.password
    );



  const user =
    await prisma.user.create({

      data: {

        name:
          data.name,


        email:
          data.email,


        passwordHash,


        role:
          data.role,

      },


      select: {

        id:true,

        name:true,

        email:true,

        role:true,

        isActive:true,

        createdAt:true,

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
      "USER",


    description:

      `Membuat user ${user.email}`,

  });





  return user;


}



// =========================
// UPDATE USER
// =========================

export async function updateUser(
  id: string,
  data: UpdateUserInput,
  userId: string
) {


  const user =
    await prisma.user.update({

      where: {

        id,

      },


      data: {

        name: data.name,

        email: data.email,

        role: data.role,

        isActive: data.isActive,

      },


      select: {

        id: true,

        name: true,

        email: true,

        role: true,

        isActive: true,

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
      "USER",


    description:

      `Mengubah data user ${user.email}`,

  });





  return user;

}

// =========================
// SOFT DELETE USER
// =========================

export async function deleteUser(
  id: string,
  userId: string
) {


  const user =
    await prisma.user.update({

      where: {

        id,

      },


      data: {

        isActive: false,

      },


      select: {

        id: true,

        name: true,

        email: true,

        role: true,

        isActive: true,

        updatedAt: true,

      },

    });





  await createAuditLog({

    userId,


    action:
      "UPDATE",


    module:
      "USER",


    description:

      `Menonaktifkan user ${user.email}`,

  });





  return user;


}

// =========================
// UPDATE USER STATUS
// =========================

export async function updateUserStatus(
  id: string,
  isActive: boolean
) {


  return await prisma.user.update({

    where: {

      id,

    },


    data: {

      isActive,

    },


    select: {

      id: true,

      name: true,

      email: true,

      role: true,

      isActive: true,

      updatedAt: true,

    },

  });

}