import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  requireCustomer,
} from "@/modules/auth/permission";


import {
  getCustomerProfile,
  updateCustomerProfile,
} from "@/modules/customer/customer.service";


import {
  validate,
} from "@/validations/validate";


import {
  updateCustomerProfileSchema,
} from "@/modules/customer/customer.validation";



// =========================
// GET CUSTOMER PROFILE
// =========================

export async function GET(

  request:NextRequest,

) {


  try {


    const customer =
      await requireCustomer(
        request,
      );



    const profile =
      await getCustomerProfile(

        customer.id,

      );



    return successResponse(

      profile,

      "Profile customer berhasil diambil",

    );



  } catch(error) {


    return handleError(
      error,
    );


  }


}







// =========================
// UPDATE CUSTOMER PROFILE
// =========================

export async function PUT(

  request:NextRequest,

) {


  try {


    const customer =
      await requireCustomer(
        request,
      );



    const body =
      await request.json();




    const data =
      validate(

        updateCustomerProfileSchema,

        body,

      );




    const updated =
      await updateCustomerProfile(

        customer.id,

        data,

      );




    return successResponse(

      updated,

      "Profile customer berhasil diperbarui",

    );



  } catch(error) {


    return handleError(
      error,
    );


  }


}