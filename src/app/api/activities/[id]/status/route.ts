import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  activityIdSchema,
  updateActivitySchema,
} from "@/modules/activity/activity.validation";


import {
  updateActivityStatus,
} from "@/modules/activity/activity.service";



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

        activityIdSchema,

        {
          id,

        }

      );



    const data =
      validate(

        updateActivitySchema,

        body

      );



    const activity =
      await updateActivityStatus(

        params.id,

        data

      );



    return successResponse(

      activity,

      "Status aktivitas berhasil diperbarui"

    );



  } catch(error) {


    return handleError(error);


  }

}