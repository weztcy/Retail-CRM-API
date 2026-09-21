import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  createActivitySchema,
} from "@/modules/activity/activity.validation";


import {
  createActivity,
} from "@/modules/activity/activity.service";



// =========================
// CREATE ACTIVITY
// =========================

export async function POST(

  request: Request

) {


  try {


    const body =
      await request.json();



    const data =
      validate(

        createActivitySchema,

        body

      );



    const activity =
      await createActivity(

        data

      );



    return successResponse(

      activity,

      "Aktivitas customer berhasil dibuat",

      201

    );



  } catch(error) {


    return handleError(error);


  }

}