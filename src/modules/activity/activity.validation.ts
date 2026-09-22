import { z } from "zod";



// =========================
// CREATE ACTIVITY
// =========================

export const createActivitySchema = z.object({

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
    .min(3),


  description: z
    .string()
    .optional(),

});



// =========================
// UPDATE STATUS
// =========================

export const updateActivitySchema =
z.object({


  status: z.enum([

    "PENDING",

    "PROCESS",

    "DONE",

    "CANCELLED",

  ]),


});



// =========================
// ACTIVITY ID
// =========================

export const activityIdSchema =
z.object({


  id: z
    .string()
    .uuid(
      "Activity ID tidak valid"
    ),


});



// =========================
// CUSTOMER ID
// =========================

export const activityCustomerIdSchema =
z.object({


  customerId: z
    .string()
    .uuid(
      "Customer ID tidak valid"
    ),


});