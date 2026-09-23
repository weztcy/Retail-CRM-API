// =========================
// CREATE CUSTOMER INPUT
// =========================

export interface CreateCustomerInput {


  customerCode:string;


  name:string;


  phone:string;


  email?:string;


  password?:string;


  imageUrl?:string;


  gender?:
    | "MALE"
    | "FEMALE"
    | "OTHER";


  birthDate?:string;


  address?:string;


  city?:string;


}





// =========================
// UPDATE CUSTOMER PROFILE
// CUSTOMER SELF SERVICE
// =========================

export interface UpdateCustomerProfileInput {


  name?:string;


  phone?:string;


  email?:string;


  password?:string;


  imageUrl?:string;


  gender?:
    | "MALE"
    | "FEMALE"
    | "OTHER";


  birthDate?:string;


  address?:string;


  city?:string;


}





// =========================
// UPDATE CUSTOMER BY ADMIN
// =========================

export interface UpdateCustomerAdminInput {


  name?:string;


  phone?:string;


  email?:string;


  imageUrl?:string;


  gender?:
    | "MALE"
    | "FEMALE"
    | "OTHER";


  birthDate?:string;


  address?:string;


  city?:string;


  membership?:
    | "BRONZE"
    | "SILVER"
    | "GOLD"
    | "PLATINUM";


  isActive?:boolean;


}





// =========================
// CUSTOMER FILTER
// =========================

export interface CustomerFilterInput {


  search?:string;


  membership?:
    | "BRONZE"
    | "SILVER"
    | "GOLD"
    | "PLATINUM";


  gender?:
    | "MALE"
    | "FEMALE"
    | "OTHER";


  city?:string;


  page?:number;


  limit?:number;


  sort?:string;


  includeInactive?:boolean;


}