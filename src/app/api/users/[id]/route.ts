import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getUserById,
  updateUser,
} from "@/modules/user/user.service";


import {
  validate,
} from "@/validations/validate";


import {
  userIdSchema,
  updateUserSchema,
} from "@/modules/user/user.validation";


import {
  ApiError,
} from "@/utils/errors/api-error";


import {
  getCurrentUser,
} from "@/modules/auth/get-current-user";

import {
  deleteUser,
} from "@/modules/user/user.service";


// =========================
// GET DETAIL USER
// =========================

export async function GET(

  request: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


    await getCurrentUser(
      request
    );



    const {
      id
    } = await context.params;



    const params =
      validate(

        userIdSchema,

        {
          id,
        }

      );




    const user =
      await getUserById(

        params.id

      );





    if (!user) {


      throw new ApiError(

        "User tidak ditemukan",

        404

      );


    }




    return successResponse(

      user,

      "Detail user berhasil diambil"

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}







// =========================
// UPDATE USER
// =========================

export async function PUT(

  request: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


    const currentUser =
      await getCurrentUser(
        request
      );



    const {
      id
    } = await context.params;




    const params =
      validate(

        userIdSchema,

        {
          id,
        }

      );




    const body =
      await request.json();





    const data =
      validate(

        updateUserSchema,

        body

      );





    const user =
      await updateUser(

        params.id,

        data,

        currentUser.id

      );





    return successResponse(

      user,

      "User berhasil diperbarui"

    );



  } catch(error) {


    return handleError(
      error
    );


  }

}

// =========================
// DELETE USER
// SOFT DELETE
// =========================

export async function DELETE(

  request: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


    const currentUser =
      await getCurrentUser(
        request
      );



    const {
      id
    } = await context.params;




    const params =
      validate(

        userIdSchema,

        {
          id,
        }

      );





    const user =
      await deleteUser(

        params.id,

        currentUser.id

      );





    return successResponse(

      user,

      "User berhasil dinonaktifkan"

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}