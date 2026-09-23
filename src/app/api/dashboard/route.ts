import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getDashboardSummary,
  getSalesAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
  getInventoryAnalytics,
  getStockValueSummary,
  getLowStockProductsDashboard,
  getLoyaltyAnalytics,
} from "@/modules/dashboard/dashboard.service";


// =========================
// DASHBOARD AGGREGATOR API
// =========================

export async function GET() {


  try {


    const [

      summary,

      sales,

      products,

      customers,

      inventory,

      stockValue,

      lowStock,

      loyalty,


    ] = await Promise.all([


      getDashboardSummary(),


      getSalesAnalytics(),


      getProductAnalytics(),


      getCustomerAnalytics(),


      getInventoryAnalytics(),


      getStockValueSummary(),


      getLowStockProductsDashboard(),


      getLoyaltyAnalytics(),


    ]);





    return successResponse(


      {


        summary,



        sales,



        products,



        customers,



        inventory: {


          analytics: inventory,


          stockValue,


          lowStock,


        },



        loyalty,


      },


      "Dashboard berhasil diambil"


    );



  } catch(error) {


    return handleError(error);


  }


}