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
  customerRegisterSchema,
} from "@/modules/auth/auth.validation";


import {
  registerCustomer,
} from "@/modules/auth/auth.service";



// =========================
// REGISTER CUSTOMER
// =========================

export async function POST(

request:NextRequest,

){


try{


  const body =
    await request.json();



  const data =
    validate(

      customerRegisterSchema,

      body,

    );



  const customer =
    await registerCustomer(

      data,

    );



  return successResponse(

    customer,

    "Registrasi customer berhasil",

  );



}catch(error){


  return handleError(error);


}


}