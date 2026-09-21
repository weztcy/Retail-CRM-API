import { z } from "zod";



// =========================
// LOGIN VALIDATION
// =========================

export const loginSchema = z.object({

  email: z
    .string()
    .email("Email tidak valid"),


  password: z
    .string()
    .min(6, "Password minimal 6 karakter"),

});




// =========================
// REFRESH TOKEN VALIDATION
// =========================

export const refreshTokenSchema = z.object({

  refreshToken: z
    .string()
    .min(
      10,
      "Refresh token tidak valid"
    ),

});