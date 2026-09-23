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
  logoutSchema,
} from "@/modules/auth/auth.validation";


import {
  logout,
} from "@/modules/auth/auth.service";



// =========================
// LOGOUT
// =========================

export async function POST(

request:NextRequest,

){


try{


  const body =
    await request.json();



  const data =
    validate(

      logoutSchema,

      body,

    );



  await logout(

    data.refreshToken,

  );




  return successResponse(

    null,

    "Logout berhasil",

  );



}catch(error){


  return handleError(error);


}


}