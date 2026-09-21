import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  authenticate,
} from "@/modules/auth/auth.middleware";




// =========================
// PROTECTED TEST API
// =========================

export async function GET(
  request: NextRequest
) {


  try {


    const user =
      await authenticate(
        request
      );



    return successResponse(

      {

        message:
          "Protected API accessed",


        user,

      },

      "Authorized"

    );



  } catch(error) {


    return handleError(
      error
    );


  }

}