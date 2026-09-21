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
  createTransactionSchema,
} from "@/modules/transaction/transaction.validation";


import {
  createTransaction,
  getTransactions,
} from "@/modules/transaction/transaction.service";


import {
  requireRole,
} from "@/modules/auth/permission";




// =========================
// GET ALL TRANSACTIONS
// =========================

export async function GET(

  request: NextRequest

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



    const transactions =
      await getTransactions();



    return successResponse(

      transactions,

      "Transaction list berhasil diambil"

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}







// =========================
// CREATE TRANSACTION
// =========================

export async function POST(

  request: NextRequest

) {


  try {


    const user =
  await requireRole(

    request,

    [
      "SUPER_ADMIN",
      "ADMIN",
      "MANAGER",
      "SALES"
    ]

  );



    const body =
      await request.json();



    const data =
      validate(

        createTransactionSchema,

        body

      );





    const transaction =
      await createTransaction(

        data,

        user.id

      );





    return successResponse(

      transaction,

      "Transaksi berhasil dibuat",

      201

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}