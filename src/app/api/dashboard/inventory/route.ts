import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getInventoryAnalytics,
} from "@/modules/dashboard/dashboard.service";



// =========================
// GET INVENTORY ANALYTICS
// =========================

export async function GET() {


  try {


    const data =
      await getInventoryAnalytics();



    return successResponse(

      data,

      "Inventory analytics berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }


}