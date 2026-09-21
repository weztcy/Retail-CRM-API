import { successResponse } from "@/utils/response";


export async function GET() {

  return successResponse(
    {
      service: "CRM Backend API",
      version: "1.0.0",
    },
    "API is running"
  );

}