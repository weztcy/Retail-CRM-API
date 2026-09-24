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
  getUserDashboardAudit,
} from "@/modules/dashboard/user/audit/audit.service";




// =========================
// GET USER AUDIT DASHBOARD
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





    const audit =

      await getUserDashboardAudit();






    return successResponse(

      audit,

      "Dashboard audit berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}