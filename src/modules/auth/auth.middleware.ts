import { NextRequest } from "next/server";


import {
  verifyToken,
} from "./jwt.utils";


import type {
  JwtPayload,
} from "./auth.types";


import {
  ApiError,
} from "@/utils/errors/api-error";




// =========================
// AUTHENTICATE REQUEST
// =========================

export async function authenticate(

  request:NextRequest,

):Promise<JwtPayload> {


  const authHeader =
    request.headers.get(
      "authorization",
    );



  if(!authHeader) {


    throw new ApiError(

      "Unauthorized",

      401,

    );


  }





  if(
    !authHeader.startsWith(
      "Bearer ",
    )
  ) {


    throw new ApiError(

      "Invalid authorization format",

      401,

    );


  }





  const token =
    authHeader.substring(7);




  if(!token) {


    throw new ApiError(

      "Token tidak ditemukan",

      401,

    );


  }





  try {


    const payload =
      await verifyToken(
        token,
      );



    if(
      !payload.id ||
      !payload.type
    ) {


      throw new ApiError(

        "Invalid token payload",

        401,

      );


    }



    return payload as JwtPayload;



  } catch(error) {


    if(error instanceof ApiError) {

      throw error;

    }



    throw new ApiError(

      "Invalid token",

      401,

    );


  }


}