// =========================
// AUTH TYPES
// =========================


export type AuthType =
  | "USER"
  | "CUSTOMER";




// =========================
// USER JWT PAYLOAD
// =========================

export interface UserJwtPayload {

  id:string;

  type:"USER";

  email:string;

  role:string;

}




// =========================
// CUSTOMER JWT PAYLOAD
// =========================

export interface CustomerJwtPayload {

  id:string;

  type:"CUSTOMER";

  phone:string;

}




// =========================
// AUTH JWT PAYLOAD
// =========================

export type JwtPayload =
  | UserJwtPayload
  | CustomerJwtPayload;




// =========================
// CURRENT USER TYPE
// =========================

export interface AuthUser {

  id:string;

  type:AuthType;

}