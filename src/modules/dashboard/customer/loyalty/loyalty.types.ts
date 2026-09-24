// =========================
// CUSTOMER LOYALTY TYPES
// =========================


export interface CustomerLoyaltyDashboard {


  overview: {

    points:number;

    totalEarned:number;

    totalRollback:number;

  };



  membership: {

    current:string;

    next:string | null;

    progress:number;

  };



  history: {

    type:string;

    points:number;

    description:string | null;

    date:Date;

  }[];


}