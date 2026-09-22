import { z } from "zod";


// =========================
// CREATE CUSTOMER ACTIVITY
// =========================

export const createCustomerActivitySchema = z.object({

  type: z.enum([

    "CALL",

    "WHATSAPP",

    "EMAIL",

    "MEETING",

    "COMPLAINT",

    "NOTE",

  ]),


  subject: z
    .string()
    .min(3, "Subject minimal 3 karakter"),


  description: z
    .string()
    .optional(),


  status: z
    .enum([

      "PENDING",

      "PROCESS",

      "DONE",

      "CANCELLED",

    ])
    .optional(),

});