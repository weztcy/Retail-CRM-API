import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getCustomerGrowth,
} from "@/modules/dashboard/dashboard.service";



// =========================
// GET CUSTOMER GROWTH
// =========================

export async function GET() {


  try {


    const data =
      await getCustomerGrowth();



    return successResponse(

      data,

      "Customer growth berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }

}