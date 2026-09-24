import { prisma } from "@/lib/prisma";

import type {
  CreateActivityInput,
  UpdateActivityInput,
} from "./activity.types";

// =========================
// GET CUSTOMER ACTIVITIES
// =========================

export async function getCustomerActivities(customerId: string) {
  return await prisma.customerActivity.findMany({
    where: {
      customerId,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,

      type: true,

      subject: true,

      description: true,

      status: true,

      createdAt: true,

      updatedAt: true,

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

// =========================
// GET ACTIVITY BY ID
// =========================

export async function getActivityById(id: string) {
  return await prisma.customerActivity.findUnique({
    where: {
      id,
    },

    select: {
      id: true,

      type: true,

      subject: true,

      description: true,

      status: true,

      createdAt: true,

      updatedAt: true,

      customer: {
        select: {
          id: true,

          customerCode: true,

          name: true,

          phone: true,
        },
      },

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

// =========================
// CREATE ACTIVITY
// =========================

export async function createActivity(data: CreateActivityInput) {
  return await prisma.customerActivity.create({
    data: {
      customerId: data.customerId,

      userId: data.userId,

      type: data.type,

      subject: data.subject,

      description: data.description,
    },

    select: {
      id: true,

      type: true,

      subject: true,

      description: true,

      status: true,

      createdAt: true,

      updatedAt: true,
    },
  });
}

// =========================
// UPDATE ACTIVITY STATUS
// =========================

export async function updateActivityStatus(
  id: string,
  data: UpdateActivityInput,
) {
  return await prisma.customerActivity.update({
    where: {
      id,
    },

    data: {
      status: data.status,
    },

    select: {
      id: true,

      type: true,

      subject: true,

      description: true,

      status: true,

      createdAt: true,

      updatedAt: true,
    },
  });
}
