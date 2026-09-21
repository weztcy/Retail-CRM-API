import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getSalesAnalytics,
} from "@/modules/dashboard/dashboard.service";



export async function GET(){


  try {


    const data =
      await getSalesAnalytics();



    return successResponse(

      data,

      "Sales analytics berhasil diambil"

    );


  }catch(error){


    return handleError(error);


  }


}