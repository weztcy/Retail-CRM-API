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



    const category =
      searchParams.get("category")
      ?? undefined;



    const status =
      searchParams.get("status")
      ?? undefined;



    const stock =
      searchParams.get("stock")
      ?? undefined;



    const sort =
      searchParams.get("sort")
      ?? undefined;



    const page =
      Number(
        searchParams.get("page")
      )
      || 1;



    const limit =
      Number(
        searchParams.get("limit")
      )
      || 10;





    const result =
      await getProducts(

        search,

        category,

        status,

        stock,

        sort,

        page,

        limit

      );





    return successResponse(

      result,

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