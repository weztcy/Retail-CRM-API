import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getCustomerLoyalty,
} from "@/modules/customer/customer.loyalty.service";




// =========================
// GET CUSTOMER LOYALTY
// =========================

export async function GET(

  _request: Request,

  context: {

    params: Promise<{

      id: string;

    }>;

  }

) {


  try {


    const {

      id

    } = await context.params;




    const data =

      await getCustomerLoyalty(

        id

      );




    return successResponse(

      data,

      "Loyalty customer berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }


}