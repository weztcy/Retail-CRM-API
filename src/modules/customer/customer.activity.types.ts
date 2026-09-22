export interface CreateCustomerActivityInput {

  type:
    | "CALL"
    | "WHATSAPP"
    | "EMAIL"
    | "MEETING"
    | "COMPLAINT"
    | "NOTE";


  subject: string;


  description?: string;


  status?:
    | "PENDING"
    | "PROCESS"
    | "DONE"
    | "CANCELLED";

}