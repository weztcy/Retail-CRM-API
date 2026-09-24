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
  getCustomerDashboardSummary,
} from "@/modules/dashboard/customer/summary/summary.service";




// =========================
// GET CUSTOMER DASHBOARD SUMMARY
// =========================

export async function GET(

  request: NextRequest

) {


  try {


    const customer =

      await requireCustomer(

        request

      );





    const summary =

      await getCustomerDashboardSummary(

        customer.id

      );






    return successResponse(

      summary,

      "Dashboard customer summary berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}