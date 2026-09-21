import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  ApiError,
} from "@/utils/errors/api-error";


import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/modules/product/product.service";


import {
  updateProductSchema,
} from "@/modules/product/product.validation";


import {
  requireRole,
} from "@/modules/auth/permission";




// =========================
// GET DETAIL PRODUCT
// =========================

export async function GET(

  request: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


    await requireRole(

  request,

  [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "SALES"
  ]

);



    const {
      id
    } = await context.params;




    const product =
      await getProductById(
        id
      );




    if (!product) {


      throw new ApiError(

        "Product tidak ditemukan",

        404

      );


    }




    return successResponse(

      product,

      "Detail product berhasil diambil"

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}







// =========================
// UPDATE PRODUCT
// =========================

export async function PUT(

  request: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


const user =
  await requireRole(

    request,

    [
      "SUPER_ADMIN",
      "ADMIN",
      "MANAGER"
    ]

  );


    const {
      id
    } = await context.params;




    const body =
      await request.json();




    const data =
      validate(

        updateProductSchema,

        body

      );






    const product =
      await updateProduct(

        id,

        data,

        user.id

      );





    return successResponse(

      product,

      "Product berhasil diperbarui"

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}







// =========================
// SOFT DELETE PRODUCT
// =========================

export async function DELETE(

  request: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


const user =
  await requireRole(

    request,

    [
      "SUPER_ADMIN",
      "ADMIN",
      "MANAGER"
    ]

  );



    const {
      id
    } = await context.params;






    const product =
      await deleteProduct(

        id,

        user.id

      );





    return successResponse(

      product,

      "Product berhasil dinonaktifkan"

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}