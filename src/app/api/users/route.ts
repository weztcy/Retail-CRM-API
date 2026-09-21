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
  createUserSchema,
} from "@/modules/user/user.validation";


import {
  createUser,
  getUsers,
} from "@/modules/user/user.service";


import {
  requireRole,
} from "@/modules/auth/permission";




// =========================
// GET ALL USERS
// =========================

export async function GET(

  request: NextRequest

) {


  try {


    await requireRole(

      request,

      [
        "SUPER_ADMIN"
      ]

    );



    const users =
      await getUsers();



    return successResponse(

      users,

      "User list berhasil diambil"

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}






// =========================
// CREATE USER
// =========================

export async function POST(

  request: NextRequest

) {


  try {


    const currentUser =
      await requireRole(

        request,

        [
          "SUPER_ADMIN"
        ]

      );



    const body =
      await request.json();



    const data =
      validate(

        createUserSchema,

        body

      );





    const user =
      await createUser(

        data,

        currentUser.id

      );





    return successResponse(

      user,

      "User berhasil dibuat",

      201

    );



  } catch(error) {


    return handleError(
      error
    );


  }

}