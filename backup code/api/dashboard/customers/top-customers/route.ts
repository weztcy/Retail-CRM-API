import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getTopCustomers,
} from "@/modules/dashboard/dashboard.service";



// =========================
// GET TOP CUSTOMERS
// =========================

export async function GET() {


  try {


    const data =
      await getTopCustomers();



    return successResponse(

      data,

      "Top customer berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }

}