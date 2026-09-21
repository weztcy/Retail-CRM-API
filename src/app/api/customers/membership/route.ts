import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  getCustomersByMembership,
} from "@/modules/customer/customer.service";


import {
  validate,
} from "@/validations/validate";


import {
  membershipSchema,
} from "@/modules/customer/customer.validation";



export async function GET(
  request: Request
) {


  try {


    const { searchParams } =
      new URL(request.url);



    const membership =
      searchParams.get(
        "level"
      );



    const data =
      validate(
        membershipSchema,
        {
          membership,
        }
      );



    const customers =
      await getCustomersByMembership(
        data.membership
      );



    return successResponse(

      customers,

      "Customer membership berhasil diambil"

    );


  } catch(error) {


    return handleError(error);


  }

}