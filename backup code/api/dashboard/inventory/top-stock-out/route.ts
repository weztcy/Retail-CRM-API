import {
  getTopStockOutProducts,
} from "@/modules/dashboard/dashboard.service";


// =========================
// GET TOP STOCK OUT PRODUCTS
// =========================

export async function GET(
  req: Request,
) {


  try {


    const {
      searchParams,
    } = new URL(req.url);




    const limitParam =

      searchParams.get("limit");




    const limit =

      limitParam

        ? Number(limitParam)

        : 10;





    const data =

      await getTopStockOutProducts(
        limit,
      );





    return Response.json({

      success:true,


      message:

        "Top stock out product berhasil diambil",



      data:{

        items:data,

      },


    });



  }

  catch(error){


    console.error(
      "TOP STOCK OUT ERROR:",
      error
    );



    return Response.json(

      {

        success:false,

        message:
          "Gagal mengambil top stock out product",

      },

      {
        status:500,
      }

    );


  }


}