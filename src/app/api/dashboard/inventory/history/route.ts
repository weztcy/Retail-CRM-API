import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getInventoryHistory,
} from "@/modules/dashboard/dashboard.service";



// =========================
// GET INVENTORY HISTORY
// =========================

export async function GET() {


  try {


    const data =
      await getInventoryHistory();



    return successResponse(

      data,

      "Inventory history berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }


}