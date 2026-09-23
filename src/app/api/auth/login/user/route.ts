import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  userLoginSchema,
} from "@/modules/auth/auth.validation";


import {
  login,
} from "@/modules/auth/auth.service";




// =========================
// LOGIN USER
// =========================

export async function POST(

  request:Request,

) {


  try {


    const body =
      await request.json();



    const data =
      validate(

        userLoginSchema,

        body,

      );



    const result =
      await login(

        data.email,

        data.password,

      );



    return successResponse(

      result,

      "Login berhasil",

    );



  } catch(error) {


    return handleError(error);


  }


}