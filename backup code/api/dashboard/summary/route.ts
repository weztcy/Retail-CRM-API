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
  getDashboardSummary,
} from "@/modules/dashboard/dashboard.service";



// =========================
// GET DASHBOARD SUMMARY
// =========================


export async function GET(
  request: NextRequest
){


  try {


    const searchParams =
      request.nextUrl.searchParams;



    const query = {


      startDate:
        searchParams.get("startDate")
        ??
        undefined,



      endDate:
        searchParams.get("endDate")
        ??
        undefined,


    };



    const filter =
      validate(

        dashboardFilterSchema,

        query

      );




    const data =
      await getDashboardSummary({


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

      "Dashboard summary berhasil diambil"

    );



  } catch(error){


    return handleError(error);


  }


}