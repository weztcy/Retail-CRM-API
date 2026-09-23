import {
  NextRequest,
} from "next/server";


import {
  authenticate,
} from "./auth.middleware";


import type {
  JwtPayload,
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



  const user =
    auth as JwtPayload;




  // =========================
  // USER AUTH
  // =========================

  if(
    user.type === "USER"
  ) {


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

  return {


    id:user.id,


    type:user.type,


    phone:user.phone,


  };


}