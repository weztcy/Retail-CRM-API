import { NextResponse } from "next/server";


import {
  ApiError
} from "./errors/api-error";



function serializeData(data: unknown) {

  return JSON.parse(

    JSON.stringify(
      data,
      (_, value) =>
        typeof value === "bigint"
          ? Number(value)
          : value
    )

  );

}



// =========================
// SUCCESS RESPONSE
// =========================

export function successResponse<T>(

  data: T,

  message = "Success",

  status = 200

) {

  return NextResponse.json(

    {
      success: true,
      message,
      data: serializeData(data),
    },

    {
      status,
    }

  );

}



// =========================
// ERROR RESPONSE
// =========================

export function errorResponse(

  message = "Something went wrong",

  errors: unknown[] = [],

  status = 500

) {

  return NextResponse.json(

    {
      success: false,
      message,
      errors: serializeData(errors),
    },

    {
      status,
    }

  );

}



// =========================
// PRISMA ERROR CHECKER
// =========================

function isPrismaError(
  error: unknown
): error is {
  code: string;
  meta?: {
    target?: string[];
  };
} {

  return (

    typeof error === "object"

    &&

    error !== null

    &&

    "code" in error

    &&

    typeof (
      error as {
        code?: unknown
      }
    ).code === "string"

  );

}



// =========================
// GLOBAL ERROR HANDLER
// =========================

export function handleError(
  error: unknown
) {


  console.error(
    "API ERROR:",
    error
  );



  // CUSTOM API ERROR

  if (
    error instanceof ApiError
  ) {


    return errorResponse(

      error.message,

      error.errors,

      error.statusCode

    );

  }



  // PRISMA ERROR

  if (
    isPrismaError(error)
  ) {



    // Duplicate unique field

    if (
      error.code === "P2002"
    ) {


      const field =
        error.meta?.target?.[0]
        ?? "Data";



      return errorResponse(

        `${field} sudah digunakan`,

        [],

        409

      );

    }



    // Record tidak ditemukan

    if (
      error.code === "P2025"
    ) {


      return errorResponse(

        "Data tidak ditemukan",

        [],

        404

      );

    }


  }



  // UNKNOWN ERROR

  return errorResponse(

    "Internal Server Error",

    [

      error instanceof Error

        ? error.message

        : String(error)

    ],

    500

  );


}