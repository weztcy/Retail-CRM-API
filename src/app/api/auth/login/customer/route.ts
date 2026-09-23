import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  customerLoginSchema,
} from "@/modules/auth/auth.validation";


import {
  loginCustomer,
} from "@/modules/auth/auth.service";



// =========================
// LOGIN CUSTOMER
// =========================

export async function POST(
  request:Request,
) {


  try {


    const body =
      await request.json();



    const data =
      validate(

        customerLoginSchema,

        body,

      );



    const result =
      await loginCustomer(

        data.email,

        data.password,

      );



    return successResponse(

      result,

      "Login customer berhasil",

    );



  } catch(error) {


    return handleError(error);


  }


}