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

// =========================
// CUSTOMER REGISTER VALIDATION
// =========================

export const customerRegisterSchema = z.object({

  name: z
    .string()
    .min(
      3,
      "Nama minimal 3 karakter",
    ),


  email: z
    .string()
    .email(
      "Email tidak valid",
    ),


  phone: z
    .string()
    .min(
      10,
      "Nomor HP minimal 10 digit",
    ),


  password: z
    .string()
    .min(
      6,
      "Password minimal 6 karakter",
    ),


  imageUrl: z
    .string()
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
    .optional(),


  address: z
    .string()
    .optional(),


  city: z
    .string()
    .optional(),


});

// =========================
// LOGOUT VALIDATION
// =========================

export const logoutSchema = z.object({

  refreshToken:z
    .string()
    .min(
      10,
      "Refresh token tidak valid",
    ),

});