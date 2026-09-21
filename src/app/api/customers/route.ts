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




// =========================
// GET ALL CUSTOMERS
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
    "SALES",
    "CUSTOMER_SERVICE"
  ]

);



    const customers =
      await getCustomers();



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