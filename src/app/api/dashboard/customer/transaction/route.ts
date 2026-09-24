import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  requireCustomer,
} from "@/modules/auth/permission";


import {
  getCustomerTransactionHistory,
} from "@/modules/dashboard/customer/transaction/transaction.service";




// =========================
// GET CUSTOMER TRANSACTION HISTORY
// =========================

export async function GET(

  request: NextRequest

) {


  try {


    const customer =

      await requireCustomer(

        request

      );





    const transactions =

      await getCustomerTransactionHistory(

        customer.id

      );






    return successResponse(

      transactions,

      "Riwayat transaksi customer berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}