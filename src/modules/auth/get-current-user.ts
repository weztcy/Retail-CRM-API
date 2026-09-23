import {
  NextRequest,
} from "next/server";


import {
  authenticate,
} from "./auth.middleware";



import type {
  UserJwtPayload,
  CustomerJwtPayload,
} from "./auth.types";




// =========================
// GET CURRENT AUTH
// =========================

export async function getCurrentUser(

  request:NextRequest,

) {


  const auth =
    await authenticate(
      request,
    );





  // =========================
  // USER AUTH
  // =========================

  if(
    auth.type === "USER"
  ) {


    const user =
      auth as UserJwtPayload;



    return {

      id:user.id,

      type:user.type,

      email:user.email,

      role:user.role,

    };


  }





  // =========================
  // CUSTOMER AUTH
  // =========================

  const customer =
    auth as CustomerJwtPayload;



  return {


    id:customer.id,


    type:customer.type,


    email:customer.email,


    phone:customer.phone,


  };


}