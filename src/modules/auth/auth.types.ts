// =========================
// JWT PAYLOAD TYPES
// =========================


export interface UserJwtPayload {

  id:string;

  type:"USER";

  email:string;

  role:string;

}



export interface CustomerJwtPayload {

  id:string;

  type:"CUSTOMER";

  email:string;

  phone:string;

}



export type JwtPayload =
  | UserJwtPayload
  | CustomerJwtPayload;





// =========================
// REGISTER CUSTOMER INPUT
// =========================


export interface RegisterCustomerInput {


  name:string;


  email:string;


  phone:string;


  password:string;


  imageUrl?:string;


  gender?:
    | "MALE"
    | "FEMALE"
    | "OTHER";


  birthDate?:string;


  address?:string;


  city?:string;


}