import {
  getInventoryMovementChart,
  getStockValueSummary,
} from "./dashboard.service";



// =========================
// INVENTORY MOVEMENT CONTROLLER
// =========================

export async function inventoryMovementController(
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
    // VALIDATE DATE
    // =========================


    if (

      parsedStartDate &&

      isNaN(parsedStartDate.getTime())

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

      isNaN(parsedEndDate.getTime())

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
      "inventoryMovementController error:",
      error
    );


    throw error;


  }


}

// =========================
// STOCK VALUE CONTROLLER
// =========================

export async function stockValueController(
  req: Request,
) {

  try {


    const data =
      await getStockValueSummary();



    return Response.json({

      success:true,

      message:
        "Stock value berhasil diambil",


      data,


    });



  } catch(error) {


    console.error(
      "stockValueController error:",
      error
    );


    return Response.json(

      {

        success:false,

        message:
          "Gagal mengambil stock value",

      },


      {
        status:500,
      }

    );


  }

}