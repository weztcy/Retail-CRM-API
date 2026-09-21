import { z } from "zod";


// =========================
// CREATE TRANSACTION
// =========================

export const createTransactionSchema =
z.object({

  customerId: z
    .string()
    .uuid("Customer ID tidak valid"),



  paymentMethod: z.enum([

    "CASH",

    "CARD",

    "TRANSFER",

    "EWALLET",

    "QRIS",

  ]),



  paymentStatus: z.enum([

    "UNPAID",

    "PAID",

    "REFUND",

  ])
  .optional(),



  notes: z
    .string()
    .optional(),



  items: z
    .array(

      z.object({

        productId: z
          .string()
          .uuid("Product ID tidak valid"),



        quantity: z
          .number()
          .int()
          .positive(
            "Quantity harus lebih dari 0"
          ),

      })

    )
    .min(
      1,
      "Minimal 1 produk"
    ),


});




// =========================
// UPDATE TRANSACTION STATUS
// =========================

export const updateTransactionStatusSchema =
z.object({

  status:
    z.enum([

      "PENDING",

      "PROCESSING",

      "COMPLETED",

      "CANCELLED",

    ]),

});