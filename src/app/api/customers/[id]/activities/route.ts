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
  getCurrentUser,
} from "@/modules/auth/get-current-user";


import {
  activityCustomerIdSchema,
  createActivitySchema,
} from "@/modules/activity/activity.validation";


import {
  getCustomerActivities,
  createActivity,
} from "@/modules/activity/activity.service";




// =========================
// GET CUSTOMER ACTIVITIES
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


    return handleError(
      error
    );


  }

}







// =========================
// CREATE CUSTOMER ACTIVITY
// =========================

export async function POST(

  request: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


    const user =
      await getCurrentUser(
        request
      );



    const {
      id
    } = await context.params;



    const params =
      validate(

        activityCustomerIdSchema,

        {
          customerId: id,
        }

      );



    const body =
      await request.json();



    const data =
      validate(

        createActivitySchema,

        body

      );



    const activity =
      await createActivity({

        customerId:
          params.customerId,


        userId:
          user.id,


        type:
          data.type,


        subject:
          data.subject,


        description:
          data.description,

      });



    return successResponse(

      activity,

      "Aktivitas customer berhasil dibuat",

      201

    );


  } catch(error) {


    return handleError(
      error
    );


  }

}