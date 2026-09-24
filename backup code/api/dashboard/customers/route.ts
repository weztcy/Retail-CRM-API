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
 customerAnalyticsSchema,
} from "@/modules/dashboard/dashboard.validation";


import {
 getCustomerAnalytics,
} from "@/modules/dashboard/dashboard.service";



export async function GET(
 request:NextRequest
){


 try {


  const query =
   Object.fromEntries(
    request.nextUrl.searchParams
   );



  const data =
   validate(

    customerAnalyticsSchema,

    query

   );



  const result =
   await getCustomerAnalytics({

    startDate:

      data.startDate
      ?
      new Date(data.startDate)
      :
      undefined,


    endDate:

      data.endDate
      ?
      new Date(data.endDate)
      :
      undefined,


    search:data.search,


    membership:data.membership,


    sort:data.sort,


    page:data.page,


    limit:data.limit,


   });



  return successResponse(

   result,

   "Customer analytics berhasil diambil"

  );


 }catch(error){


  return handleError(error);


 }

}