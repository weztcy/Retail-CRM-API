import { prisma } from "@/lib/prisma";

import type { Prisma } from "@/generated/prisma/client";

import { createAuditLog } from "@/modules/audit/audit.service";

import type {
  CreateCustomerInput,
  UpdateCustomerProfileInput,
  UpdateCustomerAdminInput,
} from "./customer.types";

import { ApiError } from "@/utils/errors/api-error";

import bcrypt from "bcrypt";

import { unlink } from "fs/promises";

import path from "path";

// =========================
// GET ALL CUSTOMERS
// =========================

export async function getCustomers(
  search?: string,

  membership?: string,

  gender?: string,

  city?: string,

  sort?: string,

  page: number = 1,

  limit: number = 10,

  includeInactive: boolean = false,
) {
  const skip = (page - 1) * limit;

  const where = {
    ...(includeInactive
      ? {}
      : {
          isActive: true,
        }),

    ...(search
      ? {
          OR: [
            {
              customerCode: {
                contains: search,
              },
            },

            {
              name: {
                contains: search,
              },
            },

            {
              phone: {
                contains: search,
              },
            },

            {
              email: {
                contains: search,
              },
            },

            {
              city: {
                contains: search,
              },
            },
          ],
        }
      : {}),

    ...(membership
      ? {
          membership: membership as "BRONZE" | "SILVER" | "GOLD" | "PLATINUM",
        }
      : {}),

    ...(gender
      ? {
          gender: gender as "MALE" | "FEMALE" | "OTHER",
        }
      : {}),

    ...(city
      ? {
          city,
        }
      : {}),
  };

  const orderBy: Prisma.CustomerOrderByWithRelationInput =
    sort === "name_asc"
      ? {
          name: "asc",
        }
      : sort === "name_desc"
        ? {
            name: "desc",
          }
        : sort === "spent_asc"
          ? {
              totalSpent: "asc",
            }
          : sort === "spent_desc"
            ? {
                totalSpent: "desc",
              }
            : sort === "oldest"
              ? {
                  createdAt: "asc",
                }
              : {
                  createdAt: "desc",
                };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,

      skip,

      take: limit,

      orderBy,

      select: {
        id: true,

        customerCode: true,

        name: true,

        phone: true,

        email: true,

        imageUrl: true,

        isActive: true,

        gender: true,

        city: true,

        membership: true,

        totalSpent: true,

        createdAt: true,

        updatedAt: true,
      },
    }),

    prisma.customer.count({
      where,
    }),
  ]);

  return {
    customers,

    pagination: {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),
    },
  };
}

// =========================
// GET CUSTOMER BY ID
// =========================

export async function getCustomerById(id: string) {
  const customer = await prisma.customer.findFirst({
    where: {
      id,
      isActive: true,
    },

    select: {
      id: true,

      customerCode: true,

      name: true,

      phone: true,

      email: true,

      imageUrl: true,

      isActive: true,

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

  if (!customer) {
    throw new ApiError("Customer tidak ditemukan", 404);
  }

  return customer;
}

// =========================
// CREATE CUSTOMER
// =========================

export async function createCustomer(
  data: CreateCustomerInput,
  userId: string,
) {
  const defaultPassword = data.password ?? data.phone.slice(-6);

  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const customer = await prisma.customer.create({
    data: {
      customerCode: data.customerCode,

      name: data.name,

      phone: data.phone,

      email: data.email,

      passwordHash,

      imageUrl: data.imageUrl,

      isActive: true,

      gender: data.gender,

      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,

      address: data.address,

      city: data.city,

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

      imageUrl: true,

      membership: true,

      isActive: true,

      totalSpent: true,

      createdAt: true,

      loyalty: {
        select: {
          points: true,
        },
      },
    },
  });

  await createAuditLog({
    userId,

    action: "CREATE",

    module: "CUSTOMER",

    description: `Membuat customer ${customer.customerCode}`,
  });

  return customer;
}

// =========================
// UPDATE CUSTOMER
// =========================

export async function updateCustomer(
  id: string,
  data: UpdateCustomerAdminInput,
  userId: string,
) {
  const customer = await prisma.customer.findFirst({
    where: {
      id,
      isActive: true,
    },

    select: {
      id: true,
      customerCode: true,
    },
  });

  if (!customer) {
    throw new ApiError(
      "Customer tidak ditemukan",

      404,
    );
  }

  const updatedCustomer = await prisma.customer.update({
    where: {
      id,
    },

    data: {
      name: data.name,

      phone: data.phone,

      email: data.email,

      imageUrl: data.imageUrl,

      gender: data.gender,

      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,

      address: data.address,

      city: data.city,

      membership: data.membership,

      isActive: data.isActive,
    },

    select: {
      id: true,

      customerCode: true,

      name: true,

      phone: true,

      email: true,

      imageUrl: true,

      membership: true,

      isActive: true,

      updatedAt: true,
    },
  });

  // =========================
  // CREATE AUDIT LOG
  // =========================

  await createAuditLog({
    userId,

    action: "UPDATE",

    module: "CUSTOMER",

    description: `Mengubah data customer ${customer.customerCode}`,
  });

  return updatedCustomer;
}

// =========================
// DELETE OLD CUSTOMER IMAGE
// =========================

async function deleteCustomerImage(imageUrl?: string | null) {
  if (!imageUrl) {
    return;
  }

  // hanya hapus file customer upload

  if (!imageUrl.startsWith("/uploads/customers/")) {
    return;
  }

  const filePath = path.join(
    process.cwd(),

    "public",

    imageUrl,
  );

  try {
    await unlink(filePath);
  } catch (error) {
    // jika file sudah tidak ada,
    // jangan gagalkan update profile

    console.warn("Old customer image tidak ditemukan", imageUrl);
  }
}

// =========================
// UPDATE CUSTOMER PROFILE
// =========================

export async function updateCustomerProfile(
  customerId: string,

  data: UpdateCustomerProfileInput,
) {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },

    select: {
      id: true,

      customerCode: true,

      imageUrl: true,
    },
  });

  if (!customer) {
    throw new ApiError("Customer tidak ditemukan", 404);
  }

  const updateData: Prisma.CustomerUpdateInput = {
    name: data.name,

    phone: data.phone,

    email: data.email,

    imageUrl: data.imageUrl,

    gender: data.gender,

    address: data.address,

    city: data.city,

    birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
  };

  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  const updatedCustomer = await prisma.customer.update({
    where: {
      id: customerId,
    },

    data: updateData,

    select: {
      id: true,

      customerCode: true,

      name: true,

      phone: true,

      email: true,

      imageUrl: true,

      membership: true,

      updatedAt: true,
    },
  });

  // =========================
  // DELETE OLD IMAGE
  // =========================

  if (data.imageUrl && data.imageUrl !== customer.imageUrl) {
    await deleteCustomerImage(customer.imageUrl);
  }

  return updatedCustomer;
}

// =========================
// DELETE CUSTOMER (SOFT)
// =========================

export async function deleteCustomer(
  id: string,

  userId: string,
) {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },

    select: {
      id: true,

      customerCode: true,

      name: true,

      isActive: true,
    },
  });

  if (!customer) {
    throw new ApiError(
      "Customer tidak ditemukan",

      404,
    );
  }
  if (!customer.isActive) {
    throw new ApiError("Customer sudah tidak aktif", 400);
  }

  const deletedCustomer = await prisma.customer.update({
    where: {
      id,
    },

    data: {
      isActive: false,
    },

    select: {
      id: true,

      customerCode: true,

      name: true,

      isActive: true,
    },
  });

  await createAuditLog({
    userId,

    action: "DELETE",

    module: "CUSTOMER",

    description: `Menonaktifkan customer ${customer.customerCode}`,
  });

  return deletedCustomer;
}

// =========================
// RESTORE CUSTOMER
// =========================

export async function restoreCustomer(id: string, userId: string) {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      customerCode: true,
      name: true,
      isActive: true,
    },
  });

  if (!customer) {
    throw new ApiError("Customer tidak ditemukan", 404);
  }

  if (customer.isActive) {
    throw new ApiError("Customer sudah aktif", 400);
  }

  const restoredCustomer = await prisma.customer.update({
    where: {
      id,
    },

    data: {
      isActive: true,
    },

    select: {
      id: true,

      customerCode: true,

      name: true,

      isActive: true,
    },
  });

  await createAuditLog({
    userId,

    action: "RESTORE",

    module: "CUSTOMER",

    description: `Mengaktifkan kembali customer ${customer.customerCode}`,
  });

  return restoredCustomer;
}

// =========================
// GET CUSTOMERS BY MEMBERSHIP
// =========================

export async function getCustomersByMembership(
  membership: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM",
) {
  return await prisma.customer.findMany({
    where: {
      membership,

      isActive: true,
    },

    select: {
      id: true,

      customerCode: true,

      name: true,

      phone: true,

      membership: true,

      totalSpent: true,

      isActive: true,
    },

    orderBy: {
      totalSpent: "desc",
    },
  });
}

// =========================
// CUSTOMER PURCHASE HISTORY
// =========================

export async function getCustomerTransactions(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },

    select: {
      id: true,

      customerCode: true,

      name: true,

      isActive: true,
    },
  });

  if (!customer) {
    throw new ApiError(
      "Customer tidak ditemukan",

      404,
    );
  }

  const transactions = await prisma.transaction.findMany({
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

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "COMPLETED",
  );

  const totalSpent = completedTransactions.reduce(
    (total, transaction) => total + Number(transaction.totalAmount),

    0,
  );

  return {
    customer,

    summary: {
      totalTransaction: transactions.length,

      totalSpent,
    },

    transactions,
  };
}

// =========================
// GET CUSTOMER PROFILE
// =========================

export async function getCustomerProfile(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },

    select: {
      id: true,

      customerCode: true,

      name: true,

      phone: true,

      email: true,

      imageUrl: true,

      gender: true,

      birthDate: true,

      address: true,

      city: true,

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

  if (!customer) {
    throw new ApiError("Customer tidak ditemukan", 404);
  }

  return customer;
}
