import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getCustomerTransactions,
} from "@/modules/customer/customer.service";




// =========================
// CUSTOMER TRANSACTIONS
// =========================

export async function GET(

  _request: Request,

  context: {

    params: Promise<{

      id: string;

    }>;

  }

) {


  try {


    const {

      id

    } = await context.params;




    const data =

      await getCustomerTransactions(

        id

      );




    return successResponse(

      data,

      "Riwayat transaksi customer berhasil diambil"

    );



  } catch(error) {


    return handleError(error);


  }

}