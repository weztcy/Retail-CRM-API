import { z } from "zod";


export const createUserSchema = z.object({

  name: z
    .string()
    .min(3, "Nama minimal 3 karakter"),


  email: z
    .string()
    .email("Email tidak valid"),


  password: z
    .string()
    .min(6, "Password minimal 6 karakter"),


  role: z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "SALES",
    "CUSTOMER_SERVICE",
  ]),

});



export const updateUserSchema = z.object({

  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .optional(),


  email: z
    .string()
    .email("Email tidak valid")
    .optional(),


  role: z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "SALES",
    "CUSTOMER_SERVICE",
  ])
  .optional(),


  isActive: z
    .boolean()
    .optional(),

});



export const userIdSchema = z.object({

  id: z
    .string()
    .uuid("User ID tidak valid"),

});

export const updateStatusSchema = z.object({

  isActive: z.boolean(),

});