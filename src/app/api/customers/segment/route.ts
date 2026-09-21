import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getCustomerSegments,
} from "@/modules/customer/customer.segment.service";




// =========================
// GET CUSTOMER SEGMENTS
// =========================

export async function GET() {


  try {


    const data =
      await getCustomerSegments();



    return successResponse(

      data,

      "Customer segmentation berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }

}