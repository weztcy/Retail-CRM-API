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
  getCustomerRecommendation,
} from "@/modules/dashboard/customer/recommendation/recommendation.service";




// =========================
// GET CUSTOMER RECOMMENDATION
// =========================

export async function GET(

  request: NextRequest

) {


  try {


    const customer =

      await requireCustomer(

        request

      );





    const recommendation =

      await getCustomerRecommendation(

        customer.id

      );






    return successResponse(

      recommendation,

      "Recommendation customer berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}