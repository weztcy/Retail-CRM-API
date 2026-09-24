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
  getUserDashboardReport,
} from "@/modules/dashboard/user/report/report.service";




// =========================
// GET USER REPORT DASHBOARD
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





    const report =

      await getUserDashboardReport();






    return successResponse(

      report,

      "Dashboard report berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}