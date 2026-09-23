import { z } from "zod";




// =========================
// USER LOGIN VALIDATION
// =========================

export const userLoginSchema = z.object({


  email: z

    .string()

    .trim()

    .email(

      "Email tidak valid",

    ),



  password: z

    .string()

    .min(

      6,

      "Password minimal 6 karakter",

    ),


});







// =========================
// CUSTOMER LOGIN VALIDATION
// =========================

export const customerLoginSchema = z.object({

  email: z
    .string()
    .email("Email tidak valid"),


  password: z
    .string()
    .min(
      6,
      "Password minimal 6 karakter",
    ),

});


// =========================
// REFRESH TOKEN VALIDATION
// =========================

export const refreshTokenSchema = z.object({


  refreshToken: z

    .string()

    .trim()

    .min(

      10,

      "Refresh token tidak valid",

    ),


});