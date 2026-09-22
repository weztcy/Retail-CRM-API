import { prisma } from "@/lib/prisma";

import { createAuditLog } from "@/modules/audit/audit.service";

import type { CreateProductInput, UpdateProductInput } from "./product.types";

import { ApiError } from "@/utils/errors/api-error";

// =========================
// GET PRODUCTS
// =========================

export async function getProducts(
  search?: string,

  category?: string,

  status?: string,

  stock?: string,

  sort?: string,

  page: number = 1,

  limit: number = 10,
) {
  const skip = (page - 1) * limit;

  const where = {
    isActive: status === "INACTIVE" ? false : true,

    ...(search
      ? {
          OR: [
            {
              sku: {
                contains: search,
              },
            },

            {
              name: {
                contains: search,
              },
            },

            {
              category: {
                contains: search,
              },
            },
          ],
        }
      : {}),

    ...(category
      ? {
          category,
        }
      : {}),

    ...(stock === "LOW"
      ? {
          stock: {
            lt: 10,
          },
        }
      : {}),

    ...(stock === "EMPTY"
      ? {
          stock: 0,
        }
      : {}),
  };

  const orderBy =
    sort === "price_asc"
      ? {
          price: "asc" as const,
        }
      : sort === "price_desc"
        ? {
            price: "desc" as const,
          }
        : sort === "stock_asc"
          ? {
              stock: "asc" as const,
            }
          : sort === "stock_desc"
            ? {
                stock: "desc" as const,
              }
            : sort === "oldest"
              ? {
                  createdAt: "asc" as const,
                }
              : {
                  createdAt: "desc" as const,
                };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,

      skip,

      take: limit,

      orderBy,

      select: {
        id: true,

        sku: true,

        name: true,

        category: true,

        price: true,

        stock: true,

        isActive: true,

        imageUrl: true,

        createdAt: true,

        updatedAt: true,
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,

    pagination: {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),
    },
  };
}

// =========================
// GET PRODUCT BY ID
// =========================

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },

    select: {
      id: true,

      sku: true,

      name: true,

      category: true,

      price: true,

      stock: true,

      isActive: true,

      imageUrl: true,

      createdAt: true,

      updatedAt: true,
    },
  });

  if (!product) {
    throw new ApiError(
      "Product tidak ditemukan",

      404,
    );
  }

  return product;
}

// =========================
// CREATE PRODUCT
// =========================

export async function createProduct(data: CreateProductInput, userId: string) {
  const existingProduct = await prisma.product.findUnique({
    where: {
      sku: data.sku,
    },

    select: {
      id: true,
    },
  });

  if (existingProduct) {
    throw new ApiError("SKU sudah digunakan", 409);
  }

  const product = await prisma.product.create({
    data: {
      sku: data.sku,

      name: data.name,

      category: data.category,

      price: data.price,

      stock: data.stock ?? 0,

      imageUrl: data.imageUrl,

      isActive: true,
    },

    select: {
      id: true,

      sku: true,

      name: true,

      category: true,

      price: true,

      stock: true,

      isActive: true,

      imageUrl: true,

      createdAt: true,

      updatedAt: true,
    },
  });

  await createAuditLog({
    userId,

    action: "CREATE",

    module: "PRODUCT",

    description: `Membuat product ${product.sku}`,
  });

  return product;
}

// =========================
// UPDATE PRODUCT
// =========================

export async function updateProduct(
  id: string,

  data: UpdateProductInput,

  userId: string,
) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      isActive: true,
    },

    select: {
      sku: true,
    },
  });

  if (!product) {
    throw new ApiError("Product tidak ditemukan", 404);
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },

    data: {
      name: data.name,

      category: data.category,

      price: data.price,

      stock: data.stock,

      isActive: data.isActive,

      imageUrl: data.imageUrl,
    },

    select: {
      id: true,

      sku: true,

      name: true,

      category: true,

      price: true,

      stock: true,

      isActive: true,

      imageUrl: true,

      updatedAt: true,
    },
  });

  await createAuditLog({
    userId,

    action: "UPDATE",

    module: "PRODUCT",

    description: `Mengubah data product ${product.sku}`,
  });

  return updatedProduct;
}

// =========================
// DELETE PRODUCT
// =========================

export async function deleteProduct(
  id: string,

  userId: string,
) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },

    select: {
      sku: true,

      name: true,

      isActive: true,
    },
  });

  if (!product) {
    throw new ApiError("Product tidak ditemukan", 404);
  }

  if (!product.isActive) {
    throw new ApiError("Product sudah tidak aktif", 400);
  }

  const deletedProduct = await prisma.product.update({
    where: {
      id,
    },

    data: {
      isActive: false,
    },

    select: {
      id: true,

      name: true,

      isActive: true,
    },
  });

  await createAuditLog({
    userId,

    action: "DELETE",

    module: "PRODUCT",

    description: `Menonaktifkan product ${product.sku}`,
  });

  return deletedProduct;
}
