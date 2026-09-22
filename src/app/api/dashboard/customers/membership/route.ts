import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getMembershipDistribution,
} from "@/modules/dashboard/dashboard.service";



// =========================
// GET MEMBERSHIP DISTRIBUTION
// =========================

export async function GET() {


  try {


    const data =
      await getMembershipDistribution();



    return successResponse(

      data,

      "Membership distribution berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }

}