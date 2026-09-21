import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getDashboardSummary,
} from "@/modules/dashboard/dashboard.service";




// =========================
// GET DASHBOARD SUMMARY
// =========================

export async function GET() {


  try {


    const data =
      await getDashboardSummary();



    return successResponse(

      data,

      "Dashboard summary berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }

}