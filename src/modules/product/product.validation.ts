import { z } from "zod";



// =========================
// CREATE PRODUCT
// =========================

export const createProductSchema =
z.object({


  sku: z
    .string()
    .min(
      3,
      "SKU minimal 3 karakter"
    ),



  name: z
    .string()
    .min(
      3,
      "Nama produk minimal 3 karakter"
    ),



  category: z
    .string()
    .min(
      2,
      "Kategori wajib diisi"
    ),



  price: z
    .number()
    .positive(
      "Harga harus lebih dari 0"
    ),



  stock: z
  .number()
  .int()
  .min(
    0,
    "Stock tidak boleh negatif"
  )
  .optional(),


imageUrl: z
  .string()
  .optional(),


});




// =========================
// UPDATE PRODUCT
// =========================

export const updateProductSchema =
z.object({


  name: z
    .string()
    .optional(),



  category: z
    .string()
    .optional(),



  price: z
    .number()
    .positive()
    .optional(),



  stock: z
    .number()
    .int()
    .min(0)
    .optional(),



  isActive: z
  .boolean()
  .optional(),


imageUrl: z
  .string()
  .optional(),


});