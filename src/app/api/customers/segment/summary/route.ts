import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getCustomerSegmentSummary,
} from "@/modules/customer/customer.segment.service";



// =========================
// GET CUSTOMER SEGMENT SUMMARY
// =========================

export async function GET() {


  try {


    const data =

      await getCustomerSegmentSummary();



    return successResponse(

      data,

      "Customer segment summary berhasil diambil"

    );



  } catch(error) {


    return handleError(error);


  }

}