import {
  hashPassword,
  comparePassword,
} from "@/modules/auth/auth.utils";

import {
  successResponse,
  handleError
} from "@/utils/response";


export async function GET() {

  try {

    const password = "Admin123!";


    const hash = await hashPassword(
      password
    );


    const compare =
      await comparePassword(
        password,
        hash
      );


    return successResponse({
      hash,
      compare,
    });


  } catch(error) {

    return handleError(error);

  }

}