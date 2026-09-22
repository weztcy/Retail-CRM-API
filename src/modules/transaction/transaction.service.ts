import { prisma } from "@/lib/prisma";

import { createAuditLog } from "@/modules/audit/audit.service";

import { ApiError } from "@/utils/errors/api-error";

import type { CreateTransactionInput } from "./transaction.types";

// =========================
// CREATE TRANSACTION
// =========================

export async function createTransaction(
  data: CreateTransactionInput,
  userId: string,
) {
  return await prisma.$transaction(async (tx) => {
    // =========================
    // CHECK CUSTOMER
    // =========================

    const customer = await tx.customer.findUnique({
      where: {
        id: data.customerId,
      },
    });

    if (!customer) {
      throw new ApiError(
        "Customer tidak ditemukan",

        404,
      );
    }

    // =========================
    // GET ACTIVE PRODUCTS
    // =========================

    const products = await tx.product.findMany({
      where: {
        id: {
          in: data.items.map((item) => item.productId),
        },

        isActive: true,
      },
    });

    if (products.length !== data.items.length) {
      throw new ApiError(
        "Product tidak ditemukan atau tidak aktif",

        404,
      );
    }

    let totalAmount = 0;

    const transactionItems = [];

    // =========================
    // CHECK STOCK + CALCULATE
    // =========================

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new ApiError(
          "Product tidak ditemukan",

          404,
        );
      }

      if (product.stock < item.quantity) {
        throw new ApiError(
          `Stock ${product.name} tidak cukup`,

          400,
        );
      }

      const price = Number(product.price);

      const subtotal = price * item.quantity;

      totalAmount += subtotal;

      transactionItems.push({
        productId: product.id,

        quantity: item.quantity,

        price,

        subtotal,
      });
    }

    // =========================
    // CREATE TRANSACTION
    // =========================

    const transaction = await tx.transaction.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),

        customerId: data.customerId,

        // PERBAIKAN:
        // gunakan userId dari request
        // untuk audit log
        userId,

        totalAmount,

        paymentMethod: data.paymentMethod,

        paymentStatus: data.paymentStatus ?? "PAID",

        notes: data.notes,
      },
    });

    // =========================
    // CREATE ITEMS
    // =========================

    await tx.transactionItem.createMany({
      data: transactionItems.map((item) => ({
        transactionId: transaction.id,

        productId: item.productId,

        quantity: item.quantity,

        price: item.price,

        subtotal: item.subtotal,
      })),
    });

    // =========================
    // UPDATE STOCK + INVENTORY LOG
    // =========================

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new ApiError("Product tidak ditemukan", 404);
      }

      await tx.product.update({
        where: {
          id: item.productId,
        },

        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      await tx.inventoryTransaction.create({
        data: {
          productId: item.productId,

          userId,

          transactionId: transaction.id,

          type: "STOCK_OUT",

          quantity: item.quantity,

          stockBefore: product.stock,

          stockAfter: product.stock - item.quantity,

          description: `Stock keluar karena transaksi ${transaction.invoiceNumber}`,
        },
      });
    }

    // =========================
    // UPDATE CUSTOMER TOTAL SPENT
    // =========================

    await tx.customer.update({
      where: {
        id: data.customerId,
      },

      data: {
        totalSpent: {
          increment: totalAmount,
        },
      },
    });

    // =========================
    // UPDATE LOYALTY POINT
    // =========================

    const points = Math.floor(totalAmount / 10000);

    if (points > 0) {
      const loyaltyAccount = await tx.loyaltyAccount.upsert({
        where: {
          customerId: data.customerId,
        },

        update: {
          points: {
            increment: points,
          },
        },

        create: {
          customerId: data.customerId,

          points,
        },
      });

      await tx.loyaltyHistory.create({
        data: {
          loyaltyAccountId: loyaltyAccount.id,

          transactionId: transaction.id,

          type: "EARN",

          points,

          description: `Reward transaksi ${transaction.invoiceNumber}`,
        },
      });
    }

    // =========================
    // CREATE AUDIT LOG
    // =========================

    await createAuditLog({
      userId,

      action: "CREATE",

      module: "TRANSACTION",

      description: `Membuat transaksi ${transaction.invoiceNumber}`,
    });

    // =========================
    // RETURN TRANSACTION
    // =========================

    return await tx.transaction.findUnique({
      where: {
        id: transaction.id,
      },

      include: {
        customer: {
          select: {
            id: true,

            customerCode: true,

            name: true,
          },
        },

        user: {
          select: {
            id: true,

            name: true,
          },
        },

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
  });
}

// =========================
// GENERATE INVOICE
// =========================

function generateInvoiceNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");

  const random = Math.floor(Math.random() * 9000) + 1000;

  return `INV-${date}-${random}`;
}

// =========================
// GET ALL TRANSACTIONS
// =========================

export async function getTransactions() {
  return await prisma.transaction.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      customer: {
        select: {
          id: true,

          customerCode: true,

          name: true,
        },
      },

      user: {
        select: {
          id: true,

          name: true,
        },
      },

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
}

// =========================
// GET TRANSACTION BY ID
// =========================

export async function getTransactionById(id: string) {
  return await prisma.transaction.findUnique({
    where: {
      id,
    },

    include: {
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

      items: {
        include: {
          product: {
            select: {
              id: true,

              sku: true,

              name: true,

              price: true,
            },
          },
        },
      },
    },
  });
}

// =========================
// UPDATE TRANSACTION STATUS
// =========================

export async function updateTransactionStatus(
  id: string,

  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED",

  userId: string,
) {
  return await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({
      where: {
        id,
      },

      include: {
        items: true,
      },
    });

    if (!transaction) {
      throw new ApiError(
        "Transaction tidak ditemukan",

        404,
      );
    }

    // =========================
    // CANCEL TRANSACTION
    // =========================

    if (status === "CANCELLED" && transaction.status !== "CANCELLED") {
      // =========================
      // RESTORE STOCK + INVENTORY LOG
      // =========================

      for (const item of transaction.items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new ApiError(
            "Product tidak ditemukan",

            404,
          );
        }

        await tx.product.update({
          where: {
            id: item.productId,
          },

          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,

            userId,

            transactionId: transaction.id,

            type: "STOCK_IN",

            quantity: item.quantity,

            stockBefore: product.stock,

            stockAfter: product.stock + item.quantity,

            description: `Stock kembali karena pembatalan transaksi ${transaction.invoiceNumber}`,
          },
        });
      }

      // =========================
      // ROLLBACK CUSTOMER SPENDING
      // =========================

      await tx.customer.update({
        where: {
          id: transaction.customerId,
        },

        data: {
          totalSpent: {
            decrement: transaction.totalAmount,
          },
        },
      });

// =========================
// ROLLBACK LOYALTY POINT
// =========================

const points =
  Math.floor(
    Number(transaction.totalAmount) / 10000
  );


if (points > 0) {


  const loyaltyAccount =
    await tx.loyaltyAccount.findUnique({

      where: {

        customerId:
          transaction.customerId,

      },

    });



  if (loyaltyAccount) {


    const newPoints =
      loyaltyAccount.points - points;



    await tx.loyaltyAccount.update({

      where: {

        id:
          loyaltyAccount.id,

      },


      data: {

        points:
          newPoints < 0
            ? 0
            : newPoints,

      },

    });



    await tx.loyaltyHistory.create({

      data: {

        loyaltyAccountId:
          loyaltyAccount.id,


        transactionId:
          transaction.id,


        type:
          "ROLLBACK",


        points:
          -points,


        description:
          `Rollback reward transaksi ${transaction.invoiceNumber}`,

      },

    });


  }

}

      // =========================
      // CREATE AUDIT LOG
      // =========================

      const oldStatus = String(transaction.status);

      const newStatus = String(status);

      if (oldStatus !== newStatus) {
        await createAuditLog({
          userId,

          action: "UPDATE",

          module: "TRANSACTION",

          description: `Mengubah status transaksi ${transaction.invoiceNumber} menjadi ${newStatus}`,
        });
      }
    }

    // =========================
    // UPDATE STATUS
    // =========================

    return await tx.transaction.update({
      where: {
        id,
      },

      data: {
        status,
      },

      include: {
        customer: {
          select: {
            id: true,

            name: true,
          },
        },

        items: true,
      },
    });
  });
}
