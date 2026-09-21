export interface CreateUserInput {

  name: string;

  email: string;

  password: string;

  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "MANAGER"
    | "SALES"
    | "CUSTOMER_SERVICE";

}


export interface UpdateUserInput {

  name?: string;

  email?: string;

  role?:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "MANAGER"
    | "SALES"
    | "CUSTOMER_SERVICE";

  isActive?: boolean;

}

export interface UserResponse {

  id: string;

  name: string;

  email: string;

  role: string;

  isActive: boolean;

}