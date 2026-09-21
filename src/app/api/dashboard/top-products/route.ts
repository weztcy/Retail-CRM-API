import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getTopProducts,
} from "@/modules/dashboard/dashboard.service";



export async function GET(){


  try {


    const data =
      await getTopProducts();



    return successResponse(

      data,

      "Top product berhasil diambil"

    );


  } catch(error){


    return handleError(error);


  }


}