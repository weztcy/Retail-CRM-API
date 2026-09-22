import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getLoyaltyAnalytics,
} from "@/modules/dashboard/dashboard.service";



// =========================
// GET LOYALTY ANALYTICS
// =========================

export async function GET() {


  try {


    const data =
      await getLoyaltyAnalytics();



    return successResponse(

      data,

      "Loyalty analytics berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }


}