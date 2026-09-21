export interface CreateCustomerInput {

  customerCode: string;


  name: string;


  phone: string;


  email?: string;


  gender?:
    | "MALE"
    | "FEMALE"
    | "OTHER";


  birthDate?: string;


  address?: string;


  city?: string;

}




export interface UpdateCustomerInput {


  name?: string;


  phone?: string;


  email?: string;


  gender?:
    | "MALE"
    | "FEMALE"
    | "OTHER";


  birthDate?: string;


  address?: string;


  city?: string;


  membership?:
    | "BRONZE"
    | "SILVER"
    | "GOLD"
    | "PLATINUM";

}