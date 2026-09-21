import { NextRequest } from "next/server";


import {
  verifyToken,
} from "./jwt.utils";


import {
  ApiError,
} from "@/utils/errors/api-error";



// =========================
// AUTHENTICATE USER
// =========================

export async function authenticate(
  request: NextRequest
) {


  const authHeader =
    request.headers.get(
      "authorization"
    );



  if (!authHeader) {

    throw new ApiError(
      "Unauthorized",
      401
    );

  }



  if (
    !authHeader.startsWith(
      "Bearer "
    )
  ) {

    throw new ApiError(
      "Invalid authorization format",
      401
    );

  }



  const token =
    authHeader.split(" ")[1];



  if (!token) {

    throw new ApiError(
      "Token tidak ditemukan",
      401
    );

  }



  try {


    const payload =
      await verifyToken(
        token
      );


    return payload;



  } catch {


    throw new ApiError(
      "Invalid token",
      401
    );


  }

}