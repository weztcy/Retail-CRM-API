import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  requireRole,
} from "@/modules/auth/permission";


import {
  getUserDashboardLoyalty,
} from "@/modules/dashboard/user/loyalty/loyalty.service";




// =========================
// GET USER LOYALTY DASHBOARD
// =========================

export async function GET(

  request: NextRequest

) {


  try {


    await requireRole(

      request,

      [

        "SUPER_ADMIN",

        "ADMIN",

        "MANAGER",

      ]

    );





    const loyalty =

      await getUserDashboardLoyalty();






    return successResponse(

      loyalty,

      "Dashboard loyalty berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}