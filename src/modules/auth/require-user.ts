import {
  NextRequest,
} from "next/server";


import {
  authenticate,
} from "./auth.middleware";


import {
  ApiError,
} from "@/utils/errors/api-error";


import type {
  UserJwtPayload,
} from "./auth.types";




// =========================
// REQUIRE USER
// =========================

export async function requireUser(

  request:NextRequest,

):Promise<UserJwtPayload>{


  const payload =
    await authenticate(
      request,
    );



  if(
    payload.type !== "USER"
  ){

    throw new ApiError(

      "User access required",

      403,

    );

  }



  return payload;


}