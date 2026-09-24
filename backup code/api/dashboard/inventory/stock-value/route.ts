import {
  getStockValueSummary,
} from "@/modules/dashboard/dashboard.service";


// =========================
// GET STOCK VALUE
// =========================

export async function GET() {


  try {


    const data =

      await getStockValueSummary();




    return Response.json({

      success:true,


      message:

        "Stock value berhasil diambil",



      data,


    });



  }

  catch(error){


    console.error(
      "STOCK VALUE ERROR:",
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