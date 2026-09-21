import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  activityCustomerIdSchema,
} from "@/modules/activity/activity.validation";


import {
  getCustomerActivities,
} from "@/modules/activity/activity.service";



export async function GET(

  _request: Request,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


    const { id } =
      await context.params;



    const params =
      validate(

        activityCustomerIdSchema,

        {
          customerId: id,
        }

      );



    const activities =
      await getCustomerActivities(

        params.customerId

      );



    return successResponse(

      activities,

      "Riwayat aktivitas customer berhasil diambil"

    );



  } catch(error) {


    return handleError(error);


  }

}