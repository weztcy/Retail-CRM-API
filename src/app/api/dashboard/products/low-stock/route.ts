import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getLowStockProducts,
} from "@/modules/dashboard/dashboard.service";



// =========================
// GET LOW STOCK PRODUCTS
// =========================

export async function GET() {


  try {


    const data =
      await getLowStockProducts();



    return successResponse(

      data,

      "Low stock product berhasil diambil"

    );



  } catch(error) {


    return handleError(error);


  }


}