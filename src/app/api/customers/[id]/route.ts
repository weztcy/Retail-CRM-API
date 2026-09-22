import {
  NextRequest,
} from "next/server";


import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "@/modules/customer/customer.service";


import {
  validate,
} from "@/validations/validate";


import {
  customerIdSchema,
  updateCustomerSchema,
} from "@/modules/customer/customer.validation";


import {
  ApiError,
} from "@/utils/errors/api-error";


import {
  requireRole,
} from "@/modules/auth/permission";




// =========================
// GET DETAIL CUSTOMER
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


    await requireRole(

      request,

      [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
        "SALES",
        "CUSTOMER_SERVICE"
      ]

    );



    const {
      id
    } = await context.params;



    const params =
      validate(

        customerIdSchema,

        {
          id,
        }

      );




    const customer =
      await getCustomerById(

        params.id

      );





    if (!customer) {


      throw new ApiError(

        "Customer tidak ditemukan",

        404

      );


    }




    return successResponse(

      customer,

      "Detail customer berhasil diambil"

    );



  } catch(error) {


    return handleError(
      error
    );


  }


}







// =========================
// UPDATE CUSTOMER
// =========================

export async function PUT(

  request: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


    const user =
      await requireRole(

        request,

        [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "SALES"
        ]

      );




    const {
      id
    } = await context.params;





    const params =
      validate(

        customerIdSchema,

        {
          id,
        }

      );





    // =========================
    // CHECK BODY
    // =========================

    const text =
      await request.text();




    if(!text.trim()){


      throw new ApiError(

        "Tidak ada data yang diperbarui",

        400

      );


    }





    let body;




    try {


      body =
        JSON.parse(text);



    } catch {


      throw new ApiError(

        "Format JSON tidak valid",

        400

      );


    }






    if(

      Object.keys(body).length === 0

    ){


      throw new ApiError(

        "Tidak ada data yang diperbarui",

        400

      );


    }







    // =========================
    // VALIDATE REQUEST BODY
    // =========================

    const data =

      validate(

        updateCustomerSchema,

        body

      );







    // =========================
    // UPDATE CUSTOMER
    // =========================

    const customer =

      await updateCustomer(

        params.id,

        data,

        user.id

      );







    return successResponse(


      customer,


      "Customer berhasil diperbarui"


    );





  } catch(error) {


    return handleError(

      error

    );


  }


}

// =========================
// DELETE CUSTOMER (SOFT DELETE)
// =========================

export async function DELETE(

  request: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }

) {


  try {


    const user =
      await requireRole(

        request,

        [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER"
        ]

      );




    const {
      id
    } = await context.params;




    const params =
      validate(

        customerIdSchema,

        {
          id,
        }

      );





    const customer =
      await deleteCustomer(

        params.id,

        user.id

      );





    return successResponse(

      customer,

      "Customer berhasil dinonaktifkan"

    );




  } catch(error) {


    return handleError(

      error

    );


  }


}