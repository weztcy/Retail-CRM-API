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
  productAnalyticsSchema,
} from "@/modules/dashboard/dashboard.validation";


import {
  getProductAnalytics,
} from "@/modules/dashboard/dashboard.service";



export async function GET(
 request:NextRequest
){


 try {


  const params =
    Object.fromEntries(
      request.nextUrl.searchParams
    );



  const query =
    validate(

      productAnalyticsSchema,

      params

    );



  const data =
    await getProductAnalytics({


      startDate:

        query.startDate
        ?
        new Date(query.startDate)
        :
        undefined,



      endDate:

        query.endDate
        ?
        new Date(query.endDate)
        :
        undefined,


      search:
        query.search,


      sort:
        query.sort,


      page:
        query.page,


      limit:
        query.limit,


    });




  return successResponse(

    data,

    "Product analytics berhasil diambil"

  );



 } catch(error){


  return handleError(error);


 }


}