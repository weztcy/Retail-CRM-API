import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getCustomers,
  createCustomer,
} from "@/modules/customer/customer.service";


import {
  validate,
} from "@/validations/validate";


import {
  createCustomerSchema,
} from "@/modules/customer/customer.validation";


import {
  requireRole,
} from "@/modules/auth/permission";


import {
  ApiError,
} from "@/utils/errors/api-error";




// =========================
// GET ALL CUSTOMERS
// =========================

export async function GET(
  request: NextRequest
) {


  try {


    const user =
      await requireRole(

        request,

        [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "SALES",
          "CUSTOMER_SERVICE"
        ]

      );




    const {
      searchParams
    } =
      new URL(request.url);





    const search =
      searchParams.get("search")
      ?? undefined;



    const membership =
      searchParams.get("membership")
      ?? undefined;



    const gender =
      searchParams.get("gender")
      ?? undefined;



    const city =
      searchParams.get("city")
      ?? undefined;



    const sort =
      searchParams.get("sort")
      ?? undefined;



    const page =
      Number(
        searchParams.get("page")
        ?? 1
      );



    const limit =
      Number(
        searchParams.get("limit")
        ?? 10
      );



    // =========================
    // INCLUDE INACTIVE CUSTOMER
    // =========================

    const includeInactive =
      searchParams.get(
        "includeInactive"
      )
      === "true";





    // hanya role tertentu boleh melihat customer nonaktif

    if(

      includeInactive &&

      ![
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER"
      ].includes(user.role)

    ){

      throw new ApiError(

        "Tidak memiliki akses melihat customer nonaktif",

        403

      );

    }







    const customers =

      await getCustomers(


        search,


        membership,


        gender,


        city,


        sort,


        page,


        limit,


        includeInactive


      );






    return successResponse(

      customers,

      "Customer list berhasil diambil"

    );




  } catch(error) {


    return handleError(
      error
    );


  }


}









// =========================
// CREATE CUSTOMER
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

          "MANAGER",

          "SALES"

        ]


      );





    const body =

      await request.json();






    const data =

      validate(

        createCustomerSchema,

        body

      );






    const customer =

      await createCustomer(


        data,


        user.id


      );







    return successResponse(


      customer,


      "Customer berhasil dibuat",


      201


    );





  } catch(error) {


    return handleError(

      error

    );


  }


}