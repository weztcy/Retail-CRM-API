import { prisma } from "@/lib/prisma";


import type {
  CreateAuditLogInput,
} from "./audit.types";




// =========================
// CREATE AUDIT LOG
// =========================

export async function createAuditLog(

  data: CreateAuditLogInput

) {


  return await prisma.auditLog.create({

    data: {

      userId:
        data.userId,


      action:
        data.action,


      module:
        data.module,


      description:
        data.description,


      ipAddress:
        data.ipAddress,

    },


    select: {

      id: true,

      action: true,

      module: true,

      description: true,

      createdAt: true,

    },

  });


}

// =========================
// GET AUDIT LOGS
// =========================

export async function getAuditLogs() {


  return await prisma.auditLog.findMany({

    orderBy: {

      createdAt: "desc",

    },


    select: {

      id: true,

      action: true,

      module: true,

      description: true,

      ipAddress: true,

      createdAt: true,


      user: {

        select: {

          id: true,

          name: true,

          email: true,

        },

      },

    },

  });


}