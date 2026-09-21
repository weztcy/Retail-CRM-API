import { z } from "zod";


export const testSchema = z.object({

  name: z
    .string()
    .min(3, "Name minimal 3 karakter"),


  email: z
    .string()
    .email("Email tidak valid"),

});