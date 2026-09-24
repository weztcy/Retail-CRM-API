// =========================
// USER DASHBOARD SUMMARY TYPES
// =========================


export interface UserDashboardSummary {


  customer: {

    total: number;

    active: number;

    newThisMonth: number;

  };



  product: {

    total: number;

    active: number;

    lowStock: number;

  };



  transaction: {

    total: number;

    today: number;

    month: number;

  };



  sales: {

    today: number;

    month: number;

  };


}