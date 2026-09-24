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
  getUserDashboardProducts,
} from "@/modules/dashboard/user/products/products.service";




// =========================
// GET USER PRODUCT DASHBOARD
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





    const products =

      await getUserDashboardProducts();






    return successResponse(

      products,

      "Dashboard product berhasil diambil"

    );





  } catch(error) {



    return handleError(

      error

    );



  }


}