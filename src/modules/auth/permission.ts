import {
  NextRequest,
} from "next/server";


import {
  getCurrentUser,
} from "./get-current-user";


import {
  ApiError,
} from "@/utils/errors/api-error";




// =========================
// REQUIRE USER ROLE
// =========================

export async function requireRole(

  request:NextRequest,

  roles:string[],

) {


  const user =
    await getCurrentUser(
      request,
    );



  // =========================
  // ONLY USER CAN HAVE ROLE
  // =========================

  if(
    user.type !== "USER"
  ) {


    throw new ApiError(

      "Forbidden",

      403,

    );


  }





  if(
    !roles.includes(
      user.role,
    )
  ) {


    throw new ApiError(

      "Forbidden",

      403,

    );


  }




  return user;

}







// =========================
// REQUIRE CUSTOMER
// =========================

export async function requireCustomer(

  request:NextRequest,

) {


  const user =
    await getCurrentUser(
      request,
    );



  if(
    user.type !== "CUSTOMER"
  ) {


    throw new ApiError(

      "Forbidden",

      403,

    );


  }




  return user;

}