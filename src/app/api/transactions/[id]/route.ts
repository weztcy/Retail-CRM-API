import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getTransactionById,
} from "@/modules/transaction/transaction.service";


import {
  ApiError,
} from "@/utils/errors/api-error";


import {
  requireRole,
} from "@/modules/auth/permission";




// =========================
// GET DETAIL TRANSACTION
// =========================

export async function GET(

  request: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


    await requireRole(

      request,

      [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
        "SALES",
        "CUSTOMER_SERVICE"
      ]

    );



    const {
      id

    } = await context.params;




    const transaction =

      await getTransactionById(

        id

      );





    if (!transaction) {


      throw new ApiError(

        "Transaction tidak ditemukan",

        404

      );


    }





    return successResponse(

      transaction,

      "Detail transaction berhasil diambil"

    );




  } catch(error) {


    return handleError(

      error

    );


  }


}