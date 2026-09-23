import { NextRequest } from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  ApiError,
} from "@/utils/errors/api-error";


import {
  writeFile,
  mkdir,
} from "fs/promises";


import path from "path";


import crypto from "crypto";


// =========================
// UPLOAD USER IMAGE
// =========================

export async function POST(
  request: NextRequest
) {


  try {


    const formData =
      await request.formData();



    const file =
      formData.get("file");



    // =========================
    // CHECK FILE
    // =========================

    if (
      !file ||
      !(file instanceof File)
    ) {

      throw new ApiError(
        "File tidak ditemukan",
        400
      );

    }



    // =========================
    // VALIDATE MIME TYPE
    // =========================

    const allowedTypes: Record<string, string> = {

      "image/jpeg": "jpeg",

      "image/jpg": "jpg",

      "image/png": "png",

      "image/webp": "webp",

    };



    const extension =
      allowedTypes[file.type];



    if (!extension) {

      throw new ApiError(
        "Format file harus JPG, JPEG, PNG, atau WEBP",
        400
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

      throw new ApiError(
        "Ukuran file maksimal 2MB",
        400
      );

    }





    // =========================
    // CREATE UNIQUE FILE NAME
    // =========================

    const filename =

      `user-${crypto.randomUUID()}.${extension}`;





    // =========================
    // UPLOAD DIRECTORY
    // =========================

    const uploadPath =

      path.join(

        process.cwd(),

        "public",

        "uploads",

        "users"

      );





    await mkdir(

      uploadPath,

      {
        recursive:true,
      }

    );





    // =========================
    // WRITE FILE
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





    // =========================
    // RETURN URL
    // =========================

    const url =

      `/uploads/users/${filename}`;





    return successResponse(

      {
        url,
      },

      "Upload user image berhasil"

    );




  } catch(error) {


    return handleError(error);


  }


}