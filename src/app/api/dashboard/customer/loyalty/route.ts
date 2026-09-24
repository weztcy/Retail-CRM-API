import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  requireCustomer,
} from "@/modules/auth/permission";


import {
  getCustomerLoyaltyDashboard,
} from "@/modules/dashboard/customer/loyalty/loyalty.service";




// =========================
// GET CUSTOMER LOYALTY DASHBOARD
// =========================

export async function GET(

  request: NextRequest

) {


  try {


    const customer =

      await requireCustomer(

        request

      );





    const loyalty =

      await getCustomerLoyaltyDashboard(

        customer.id

      );






    return successResponse(

      loyalty,

      "Dashboard loyalty customer berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}