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
  createProductSchema,
} from "@/modules/product/product.validation";


import {
  createProduct,
  getProducts,
} from "@/modules/product/product.service";


import {
  requireRole,
} from "@/modules/auth/permission";




// =========================
// GET ALL PRODUCTS
// =========================

export async function GET(
  request: NextRequest
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



    const { searchParams } =
      new URL(request.url);



    const search =
      searchParams.get("search")
      ?? undefined;



    const products =
      await getProducts(
        search
      );



    return successResponse(

      products,

      "Product list berhasil diambil"

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}

// =========================
// CREATE PRODUCT
// =========================

export async function POST(

  request: NextRequest

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



    const body =
      await request.json();



    const data =
      validate(

        createProductSchema,

        body

      );




    const product =
      await createProduct(

        data,

        user.id

      );



    return successResponse(

      product,

      "Product berhasil dibuat",

      201

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}