import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/modules/auth/jwt.utils";


export async function middleware(
  request: NextRequest
) {


  const token =
    request.headers
      .get("authorization")
      ?.replace("Bearer ", "");



  if (!token) {

    return NextResponse.json(

      {
        success: false,
        message: "Unauthorized",
      },

      {
        status: 401,
      }

    );

  }



  try {

    await verifyToken(token);


    return NextResponse.next();



  } catch {


    return NextResponse.json(

      {
        success: false,
        message: "Invalid token",
      },

      {
        status: 401,
      }

    );

  }

}



export const config = {

  matcher: [

    "/api/protected/:path*"

  ],

};