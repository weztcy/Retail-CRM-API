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
  getUserDashboardInventory,
} from "@/modules/dashboard/user/inventory/inventory.service";


// =========================
// GET USER INVENTORY DASHBOARD
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





    const inventory =

      await getUserDashboardInventory();






    return successResponse(

      inventory,

      "Dashboard inventory berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}