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
    .startsWith(
      "/uploads/",
      "Image URL tidak valid"
    )
    .optional(),

});




// =========================
// UPDATE PRODUCT
// =========================

export const updateProductSchema =
z.object({

  name: z
    .string()
    .min(
      3,
      "Nama produk minimal 3 karakter"
    )
    .optional(),



  category: z
    .string()
    .min(
      2,
      "Kategori wajib diisi"
    )
    .optional(),



  price: z
    .number()
    .positive(
      "Harga harus lebih dari 0"
    )
    .optional(),



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
    .startsWith(
      "/uploads/",
      "Image URL tidak valid"
    )
    .optional(),


});