import {
  getLowStockProductsDashboard,
} from "@/modules/dashboard/dashboard.service";


// =========================
// GET LOW STOCK
// =========================

export async function GET() {


  try {


    const data =

      await getLowStockProductsDashboard();




    return Response.json({

      success:true,


      message:

        "Low stock berhasil diambil",



      data,


    });



  }

  catch(error){


    console.error(
      "LOW STOCK ERROR:",
      error
    );



    return Response.json(

      {

        success:false,

        message:
          "Gagal mengambil low stock",

      },

      {
        status:500,
      }

    );


  }


}