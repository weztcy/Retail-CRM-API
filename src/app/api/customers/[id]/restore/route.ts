import {
 NextRequest
} from "next/server";


import {
 successResponse,
 handleError
} from "@/utils/response";


import {
 requireRole
} from "@/modules/auth/permission";


import {
 validate
} from "@/validations/validate";


import {
 customerIdSchema
} from "@/modules/customer/customer.validation";


import {
 restoreCustomer
} from "@/modules/customer/customer.service";




export async function PUT(

 request:NextRequest,

 context:{
   params:Promise<{
     id:string
   }>
 }

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




const {
id
}=await context.params;



const params =
validate(

customerIdSchema,

{
id
}

);




const customer =
await restoreCustomer(

params.id,

user.id

);




return successResponse(

customer,

"Customer berhasil dipulihkan"

);



}catch(error){


return handleError(error);


}



}