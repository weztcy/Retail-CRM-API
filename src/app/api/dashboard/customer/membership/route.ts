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
  getCustomerMembershipStatus,
} from "@/modules/dashboard/customer/membership/membership.service";




// =========================
// GET CUSTOMER MEMBERSHIP STATUS
// =========================

export async function GET(

  request: NextRequest

) {


  try {


    const customer =

      await requireCustomer(

        request

      );





    const membership =

      await getCustomerMembershipStatus(

        customer.id

      );






    return successResponse(

      membership,

      "Dashboard membership customer berhasil diambil"

    );





  } catch(error) {


    return handleError(

      error

    );


  }


}