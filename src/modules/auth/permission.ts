import {
  NextRequest,
} from "next/server";


import {
  getCurrentUser,
} from "./get-current-user";


import {
  ApiError,
} from "@/utils/errors/api-error";



export async function requireRole(

  request: NextRequest,

  roles: string[]

) {


  const user =
    await getCurrentUser(
      request
    );



  if (!roles.includes(
    user.role as string
  )) {


    throw new ApiError(

      "Forbidden",

      403

    );


  }



  return user;

}