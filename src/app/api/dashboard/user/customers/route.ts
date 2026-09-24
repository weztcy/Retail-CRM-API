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
  getUserDashboardCustomers,
} from "@/modules/dashboard/user/customers/customers.service";




// =========================
// GET USER CUSTOMER DASHBOARD
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





    const customers =

      await getUserDashboardCustomers();






    return successResponse(

      customers,

      "Dashboard customer berhasil diambil"

    );




  } catch(error) {


    return handleError(

      error

    );


  }


}