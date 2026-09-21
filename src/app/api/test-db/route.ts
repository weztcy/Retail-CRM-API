import { validate } from "@/validations/validate";
import { testSchema } from "@/validations/test.validation";
import { successResponse, handleError } from "@/utils/response";


export async function POST(request: Request) {

  try {

    const body = await request.json();


    const data = validate(
      testSchema,
      body
    );


    return successResponse(
      data,
      "Validation success"
    );


  } catch(error) {

    return handleError(error);

  }

}