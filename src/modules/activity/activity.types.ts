export interface CreateActivityInput {


  customerId: string;


  userId: string;


  type:
    | "CALL"
    | "WHATSAPP"
    | "EMAIL"
    | "MEETING"
    | "COMPLAINT"
    | "NOTE";


  subject: string;


  description?: string;

}



export interface UpdateActivityInput {


  status:
    | "PENDING"
    | "PROCESS"
    | "DONE"
    | "CANCELLED";

}