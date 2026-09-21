import {
  NextRequest,
} from "next/server";


import {
  authenticate,
} from "./auth.middleware";



export async function getCurrentUser(
  request: NextRequest
) {


  const user =
    await authenticate(
      request
    );


  return {

    id: String(user.id),

    email: String(user.email),

    role: String(user.role),

  };


}