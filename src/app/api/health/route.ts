import {
  successResponse,
} from "@/utils/response";


export async function GET(){

  return successResponse(

    {
      status:"OK",
      service:"Retail CRM API",
    },

    "API is running"

  );

}