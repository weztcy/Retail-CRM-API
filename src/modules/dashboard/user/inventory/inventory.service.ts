import { prisma } from "@/lib/prisma";

import type { UserDashboardInventory } from "./inventory.types";

// =========================
// GET USER INVENTORY DASHBOARD
// =========================

export async function getUserDashboardInventory(): Promise<UserDashboardInventory> {
  const [
    products,

    lowStock,

    totalMovement,

    movementData,

    recentActivity,

    stockOutData,
  ] = await Promise.all([
    // =========================
    // PRODUCT STOCK
    // =========================

    prisma.product.findMany({
      where: {
        isActive: true,
      },

      select: {
        id: true,

        category: true,

        stock: true,

        price: true,
      },
    }),

    // =========================
    // LOW STOCK
    // =========================

    prisma.product.count({
      where: {
        isActive: true,

        stock: {
          lte: 10,
        },
      },
    }),

    // =========================
    // TOTAL INVENTORY MOVEMENT
    // =========================

    prisma.inventoryTransaction.count(),

    // =========================
    // MOVEMENT SUMMARY
    // =========================

    prisma.inventoryTransaction.findMany({
      select: {
        type: true,

        quantity: true,
      },
    }),

    // =========================
    // RECENT ACTIVITY
    // =========================

    prisma.inventoryTransaction.findMany({
      take: 10,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        productId: true,

        type: true,

        quantity: true,

        stockBefore: true,

        stockAfter: true,

        createdAt: true,

        product: {
          select: {
            name: true,
          },
        },
      },
    }),

    // =========================
    // FAST MOVING PRODUCT
    // STOCK OUT
    // =========================

    prisma.inventoryTransaction.findMany({
      where: {
        type: "STOCK_OUT",
      },

      select: {
        quantity: true,

        product: {
          select: {
            id: true,

            name: true,
          },
        },
      },
    }),
  ]);

  // =========================
  // STOCK VALUE
  // =========================

  const totalStock = products.reduce(
    (total, item) => total + item.stock,

    0,
  );

  const totalStockValue = products.reduce(
    (total, item) => total + item.stock * Number(item.price),

    0,
  );

  // =========================
  // STOCK VALUE BY CATEGORY
  // =========================

  const categoryMap = new Map<
    string,
    {
      totalStock: number;

      stockValue: number;
    }
  >();

  products.forEach((item) => {
    const current = categoryMap.get(item.category) ?? {
      totalStock: 0,

      stockValue: 0,
    };

    current.totalStock += item.stock;

    current.stockValue += item.stock * Number(item.price);

    categoryMap.set(
      item.category,

      current,
    );
  });

  const stockValueByCategory = Array.from(categoryMap.entries())

    .map(([category, value]) => ({
      category,

      ...value,
    }))

    .sort((a, b) => b.stockValue - a.stockValue);

  // =========================
  // MOVEMENT PROCESS
  // =========================

  const movementMap = new Map<
    string,
    {
      quantity: number;

      totalTransaction: number;
    }
  >();

  movementData.forEach((item) => {
    const current = movementMap.get(item.type) ?? {
      quantity: 0,

      totalTransaction: 0,
    };

    current.quantity += item.quantity;

    current.totalTransaction += 1;

    movementMap.set(
      item.type,

      current,
    );
  });

  // =========================
  // FAST MOVING PRODUCT
  // =========================

  const fastMap = new Map<
    string,
    {
      productId: string;

      productName: string;

      totalOut: number;
    }
  >();

  stockOutData.forEach((item) => {
    const id = item.product.id;

    const current = fastMap.get(id) ?? {
      productId: id,

      productName: item.product.name,

      totalOut: 0,
    };

    current.totalOut += item.quantity;

    fastMap.set(
      id,

      current,
    );
  });

  return {
    overview: {
      totalStock,

      totalStockValue,

      lowStock,

      totalMovement,
    },

    movement: Array.from(movementMap.entries())

      .map(([type, value]) => ({
        type,

        ...value,
      })),

    recentActivity: recentActivity.map((item) => ({
      productId: item.productId,

      productName: item.product.name,

      type: item.type,

      quantity: item.quantity,

      stockBefore: item.stockBefore,

      stockAfter: item.stockAfter,

      createdAt: item.createdAt,
    })),

    fastMovingProducts: Array.from(fastMap.values())

      .sort((a, b) => b.totalOut - a.totalOut)

      .slice(0, 10),

    // =========================
    // NEW
    // =========================

    stockValueByCategory,
  };
}
