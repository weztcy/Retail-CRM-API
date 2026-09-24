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
  getUserDashboardSales,
} from "@/modules/dashboard/user/sales/sales.service";




// =========================
// GET USER SALES DASHBOARD
// =========================

export async function GET(

  request:NextRequest

){


  try {


    await requireRole(

      request,

      [

        "SUPER_ADMIN",

        "ADMIN",

        "MANAGER",

      ]

    );




    const sales =

      await getUserDashboardSales();





    return successResponse(

      sales,

      "Dashboard sales berhasil diambil"

    );



  } catch(error){


    return handleError(
      error
    );


  }


}