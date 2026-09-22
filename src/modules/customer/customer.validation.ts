import { z } from "zod";


// =========================
// CREATE CUSTOMER
// =========================

export const createCustomerSchema = z.object({


  customerCode: z

    .string()

    .min(
      3,
      "Customer code minimal 3 karakter"
    ),



  name: z

    .string()

    .min(
      3,
      "Nama minimal 3 karakter"
    ),



  phone: z

    .string()

    .min(
      8,
      "Nomor telepon tidak valid"
    ),



  email: z

    .string()

    .email(
      "Email tidak valid"
    )

    .optional(),



  imageUrl: z
  .string()
  .startsWith(
    "/uploads/",
    "Image URL tidak valid"
  )
  .optional(),



  gender: z

    .enum([

      "MALE",

      "FEMALE",

      "OTHER",

    ])

    .optional(),



  birthDate: z

    .string()

    .date()

    .optional(),



  address: z

    .string()

    .optional(),



  city: z

    .string()

    .optional(),


});





// =========================
// UPDATE CUSTOMER
// =========================

export const updateCustomerSchema = z.object({


  name: z

    .string()

    .min(
      3
    )

    .optional(),



  phone: z

    .string()

    .min(
      8
    )

    .optional(),



  email: z

    .string()

    .email()

    .optional(),



  imageUrl: z
  .string()
  .startsWith(
    "/uploads/",
    "Image URL tidak valid"
  )
  .optional(),



  gender: z

    .enum([

      "MALE",

      "FEMALE",

      "OTHER",

    ])

    .optional(),



  birthDate: z

    .string()

    .date()

    .optional(),



  address: z

    .string()

    .optional(),



  city: z

    .string()

    .optional(),



  membership: z

    .enum([

      "BRONZE",

      "SILVER",

      "GOLD",

      "PLATINUM",

    ])

    .optional(),


});





// =========================
// CUSTOMER ID
// =========================

export const customerIdSchema = z.object({


  id: z

    .string()

    .uuid(
      "Customer ID tidak valid"
    ),


});





// =========================
// MEMBERSHIP FILTER
// =========================

export const membershipSchema = z.object({


  membership: z.enum([

    "BRONZE",

    "SILVER",

    "GOLD",

    "PLATINUM",

  ]),


});