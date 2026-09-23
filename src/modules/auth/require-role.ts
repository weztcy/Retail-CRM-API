import {
  NextRequest,
} from "next/server";


import {
  requireUser,
} from "./require-user";


import {
  ApiError,
} from "@/utils/errors/api-error";




// =========================
// REQUIRE ROLE
// =========================

export async function requireRole(

  request:NextRequest,

  roles:string[],

) {


  const user =
    await requireUser(
      request,
    );



  if(
    !roles.includes(user.role)
  ) {


    throw new ApiError(

      "Forbidden",

      403,

    );


  }



  return user;


}