import {
  getInventoryMovementChart,
} from "@/modules/dashboard/dashboard.service";


// =========================
// GET INVENTORY MOVEMENT
// =========================

export async function GET(
  req: Request,
) {


  try {


    const {
      searchParams,
    } = new URL(req.url);



    const startDate =
      searchParams.get("startDate");


    const endDate =
      searchParams.get("endDate");





    const parsedStartDate =

      startDate

        ? new Date(startDate)

        : undefined;




    const parsedEndDate =

      endDate

        ? new Date(endDate)

        : undefined;





    // =========================
    // VALIDATION
    // =========================

    if (

      parsedStartDate &&

      isNaN(
        parsedStartDate.getTime()
      )

    ) {


      return Response.json(

        {

          success:false,

          message:
            "Format startDate tidak valid",

        },

        {
          status:400,
        }

      );


    }





    if (

      parsedEndDate &&

      isNaN(
        parsedEndDate.getTime()
      )

    ) {


      return Response.json(

        {

          success:false,

          message:
            "Format endDate tidak valid",

        },

        {
          status:400,
        }

      );


    }





    const data =

      await getInventoryMovementChart(

        parsedStartDate,

        parsedEndDate,

      );





    return Response.json({

      success:true,


      message:

        "Inventory movement berhasil diambil",



      data:{

        items:data,

      },


    });



  }

  catch(error){


    console.error(
      "GET INVENTORY MOVEMENT ERROR:",
      error
    );



    return Response.json(

      {

        success:false,

        message:
          "Gagal mengambil inventory movement",

      },

      {
        status:500,
      }

    );


  }


}