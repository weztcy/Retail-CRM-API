import {
  NextRequest,
} from "next/server";


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
// UPLOAD CUSTOMER IMAGE
// =========================

export async function POST(

  request: NextRequest,

) {


  try {


    const formData =
      await request.formData();



    const file =
      formData.get("file");





    // =========================
    // CHECK FILE
    // =========================

    if(

      !file ||

      !(file instanceof File)

    ){

      throw new ApiError(

        "File tidak ditemukan",

        400,

      );

    }





    // =========================
    // VALIDATE FILE TYPE
    // =========================

    const allowedTypes:
      Record<string,string> = {


        "image/jpeg":
          "jpg",


        "image/jpg":
          "jpg",


        "image/png":
          "png",


        "image/webp":
          "webp",


      };




    const extension =
      allowedTypes[file.type];




    if(!extension){


      throw new ApiError(

        "Format file harus JPG, JPEG, PNG, atau WEBP",

        400,

      );


    }





    // =========================
    // VALIDATE FILE SIZE
    // MAX 2MB
    // =========================

    const maxSize =
      2 * 1024 * 1024;




    if(file.size > maxSize){


      throw new ApiError(

        "Ukuran file maksimal 2MB",

        400,

      );


    }





    // =========================
    // CREATE FILE NAME
    // =========================

    const filename =

      `customer-${crypto.randomUUID()}.${extension}`;






    // =========================
    // CREATE UPLOAD DIRECTORY
    // =========================

    const uploadPath =

      path.join(

        process.cwd(),

        "public",

        "uploads",

        "customers",

      );





    await mkdir(

      uploadPath,

      {
        recursive:true,
      },

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

        filename,

      ),

      buffer,

    );






    // =========================
    // IMAGE URL
    // =========================

    const url =

      `/uploads/customers/${filename}`;






    return successResponse(

      {
        url,
      },

      "Upload customer image berhasil",

    );





  } catch(error){


    return handleError(

      error,

    );


  }


}