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
  CustomerJwtPayload,
} from "./auth.types";




// =========================
// REQUIRE CUSTOMER
// =========================

export async function requireCustomer(

  request:NextRequest,

):Promise<CustomerJwtPayload>{


  const payload =
    await authenticate(
      request,
    );



  if(
    payload.type !== "CUSTOMER"
  ){

    throw new ApiError(

      "Customer access required",

      403,

    );

  }



  return payload;


}