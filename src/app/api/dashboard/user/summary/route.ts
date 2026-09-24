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
  getUserDashboardSummary,
} from "@/modules/dashboard/user/summary/summary.service";




// =========================
// GET USER DASHBOARD SUMMARY
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




    const summary =

      await getUserDashboardSummary();





    return successResponse(

      summary,

      "Dashboard summary berhasil diambil"

    );




  } catch(error) {


    return handleError(

      error

    );


  }


}