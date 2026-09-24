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
  getTeamPerformanceDashboard,
} from "@/modules/dashboard/user/team-performance/team-performance.service";




// =========================
// GET TEAM PERFORMANCE
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





    const dashboard =

      await getTeamPerformanceDashboard();






    return successResponse(

      dashboard,

      "Dashboard team performance berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}