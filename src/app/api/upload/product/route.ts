import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  writeFile,
  mkdir,
} from "fs/promises";


import path from "path";




// =========================
// UPLOAD PRODUCT IMAGE
// =========================

export async function POST(

  request: NextRequest

) {


  try {


    const formData =
      await request.formData();



    const file =
      formData.get("file");



    if (
      !file ||
      !(file instanceof File)
    ) {

      throw new Error(
        "File tidak ditemukan"
      );

    }





    // =========================
    // VALIDATE FILE TYPE
    // =========================

    const allowedTypes = [

      "image/jpeg",

      "image/png",

      "image/webp",

    ];



    if (
      !allowedTypes.includes(
        file.type
      )
    ) {


      throw new Error(
        "Format file harus JPG, PNG, atau WEBP"
      );


    }





    // =========================
    // VALIDATE SIZE
    // MAX 2MB
    // =========================

    const maxSize =
      2 * 1024 * 1024;



    if (
      file.size > maxSize
    ) {


      throw new Error(
        "Ukuran file maksimal 2MB"
      );


    }





    // =========================
    // CREATE FILENAME
    // =========================

    const extension =
      file.name
        .split(".")
        .pop();



    const filename =

      `product-${Date.now()}.${extension}`;





    const uploadPath =

      path.join(

        process.cwd(),

        "public",

        "uploads",

        "products"

      );





    await mkdir(

      uploadPath,

      {
        recursive: true,
      }

    );





    // =========================
    // SAVE FILE
    // =========================

    const bytes =
      await file.arrayBuffer();



    const buffer =
      Buffer.from(bytes);




    await writeFile(

      path.join(

        uploadPath,

        filename

      ),

      buffer

    );






    const url =

      `/uploads/products/${filename}`;





    return successResponse(

      {
        url,
      },

      "Upload image berhasil"

    );





  } catch(error) {


    return handleError(
      error
    );


  }


}