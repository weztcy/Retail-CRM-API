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
  getCustomerPurchaseAnalytics,
} from "@/modules/dashboard/customer/purchase/purchase.service";




// =========================
// GET CUSTOMER PURCHASE ANALYTICS
// =========================

export async function GET(

  request: NextRequest

) {


  try {


    const customer =

      await requireCustomer(

        request

      );





    const purchase =

      await getCustomerPurchaseAnalytics(

        customer.id

      );






    return successResponse(

      purchase,

      "Dashboard purchase customer berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}