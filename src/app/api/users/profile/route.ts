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
  updateUserProfileSchema,
} from "@/modules/user/user.validation";


import {
  getUserProfile,
  updateUserProfile,
} from "@/modules/user/user.service";


import {
  requireUser,
} from "@/modules/auth/permission";



// =========================
// GET USER PROFILE
// SELF
// =========================

export async function GET(

  request: NextRequest

) {


  try {


    const user =

      await requireUser(

        request

      );




    const profile =

      await getUserProfile(

        user.id

      );





    return successResponse(

      profile,

      "Profile user berhasil diambil"

    );




  } catch(error) {


    return handleError(

      error

    );


  }


}





// =========================
// UPDATE USER PROFILE
// SELF
// =========================

export async function PUT(

  request: NextRequest

) {


  try {


    const user =

      await requireUser(

        request

      );





    const body =

      await request.json();





    const data =

      validate(

        updateUserProfileSchema,

        body

      );





    const updatedUser =

      await updateUserProfile(

        user.id,

        data

      );





    return successResponse(

      updatedUser,

      "Profile user berhasil diperbarui"

    );




  } catch(error) {


    return handleError(

      error

    );


  }


}