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
  createInventoryAdjustmentSchema,
} from "@/modules/inventory/inventory.validation";


import {
  createInventoryAdjustment,
} from "@/modules/inventory/inventory.service";


import {
  requireRole,
} from "@/modules/auth/permission";




// =========================
// CREATE INVENTORY ADJUSTMENT
// =========================


export async function POST(

request:NextRequest

){


try{


const user =

await requireRole(

request,

[

"SUPER_ADMIN",

"ADMIN",

"MANAGER"

]

);




const body =

await request.json();




const data =

validate(

createInventoryAdjustmentSchema,

body

);




const result =

await createInventoryAdjustment(

data,

user.id

);




return successResponse(

result,

"Stock adjustment berhasil",

201

);



}

catch(error){


return handleError(error);


}


}