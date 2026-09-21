import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  updateTransactionStatusSchema,
} from "@/modules/transaction/transaction.validation";


import {
  updateTransactionStatus,
} from "@/modules/transaction/transaction.service";


import {
  requireRole,
} from "@/modules/auth/permission";




// =========================
// UPDATE TRANSACTION STATUS
// =========================

export async function PATCH(

  request: NextRequest,

  context: {

    params: Promise<{

      id: string;

    }>;

  }

) {


  try {


    const user =
      await requireRole(

        request,

        [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER"
        ]

      );



    const {

      id

    } = await context.params;



    const body =
      await request.json();



    const data =
      validate(

        updateTransactionStatusSchema,

        body

      );





    const transaction =
      await updateTransactionStatus(

        id,

        data.status,

        user.id

      );





    return successResponse(

      transaction,

      "Status transaksi berhasil diperbarui"

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}