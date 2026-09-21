import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  userIdSchema,
  updateStatusSchema,
} from "@/modules/user/user.validation";


import {
  updateUserStatus,
} from "@/modules/user/user.service";



export async function PATCH(

  request: Request,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


    const { id } =
      await context.params;



    const body =
      await request.json();



    const params =
      validate(
        userIdSchema,
        {
          id,
        }
      );



    const data =
      validate(
        updateStatusSchema,
        body
      );



    const user =
      await updateUserStatus(
        params.id,
        data.isActive
      );



    return successResponse(
      user,
      "Status user berhasil diperbarui"
    );


  } catch(error) {


    return handleError(error);


  }

}