import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  dashboardFilterSchema,
} from "@/modules/dashboard/dashboard.validation";


import {
  getSalesAnalytics,
} from "@/modules/dashboard/dashboard.service";




// =========================
// GET SALES ANALYTICS
// =========================


export async function GET(
  request:NextRequest
){


  try {


    const params =
      request.nextUrl.searchParams;



    const query = {


      startDate:
        params.get("startDate")
        ??
        undefined,



      endDate:
        params.get("endDate")
        ??
        undefined,


    };



    const filter =
      validate(

        dashboardFilterSchema,

        query

      );



    const data =
      await getSalesAnalytics({


        startDate:

          filter.startDate
          ?
          new Date(filter.startDate)
          :
          undefined,



        endDate:

          filter.endDate
          ?
          new Date(filter.endDate)
          :
          undefined,


      });




    return successResponse(

      data,

      "Sales analytics berhasil diambil"

    );



  } catch(error){


    return handleError(error);


  }


}