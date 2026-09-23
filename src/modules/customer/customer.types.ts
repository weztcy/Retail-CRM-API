// =========================
// CREATE CUSTOMER INPUT
// =========================

export interface CreateCustomerInput {

  customerCode: string;

  name: string;

  phone: string;

  email?: string;

  password?: string;

  imageUrl?: string;

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

  isActive?: boolean;

}





// =========================
// UPDATE CUSTOMER INPUT
// =========================

export interface UpdateCustomerInput {

  name?: string;

  phone?: string;

  email?: string;

  password?: string;

  imageUrl?: string;

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

  isActive?: boolean;

}