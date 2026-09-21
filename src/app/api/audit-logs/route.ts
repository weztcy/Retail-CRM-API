import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getAuditLogs,
} from "@/modules/audit/audit.service";


import {
  requireRole,
} from "@/modules/auth/permission";




// =========================
// GET AUDIT LOGS
// =========================

export async function GET(

  request: NextRequest

) {


  try {


    await requireRole(

      request,

      [
        "SUPER_ADMIN",
        "ADMIN"
      ]

    );



    const data =

      await getAuditLogs();



    return successResponse(

      data,

      "Audit log berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }

}