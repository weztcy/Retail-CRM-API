// =========================
// CUSTOMER MEMBERSHIP TYPES
// =========================


export interface CustomerMembershipDashboard {


  currentLevel:string;


  nextLevel:string | null;



  progress:{

    currentSpent:number;

    targetSpent:number;

    remaining:number;

    percentage:number;

  };



  benefits:string[];


}