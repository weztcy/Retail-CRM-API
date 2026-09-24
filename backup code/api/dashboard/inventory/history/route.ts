import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getInventoryHistory,
} from "@/modules/dashboard/dashboard.service";


import {
  InventoryType,
} from "@/generated/prisma/client";




// =========================
// GET INVENTORY HISTORY
// =========================

export async function GET(
  request: NextRequest
) {


  try {


    const {
      searchParams
    } = new URL(request.url);




    const search =
      searchParams.get("search")
      ?? undefined;



    const typeParam =
      searchParams.get("type");



    const type =
      typeParam
        ? typeParam as InventoryType
        : undefined;




    const sort =
      searchParams.get("sort")
      ?? undefined;



    const page =
      Number(
        searchParams.get("page")
      )
      || 1;




    const limit =
      Number(
        searchParams.get("limit")
      )
      || 10;





    const data =
      await getInventoryHistory(

        search,

        type,

        sort,

        page,

        limit

      );





    return successResponse(

      data,

      "Inventory history berhasil diambil"

    );



  } catch(error) {


    return handleError(error);


  }


}