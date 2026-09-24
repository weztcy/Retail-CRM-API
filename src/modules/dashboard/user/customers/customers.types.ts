// =========================
// USER DASHBOARD CUSTOMER TYPES
// =========================


export interface UserDashboardCustomers {


  overview: {

    total: number;

    active: number;

    inactive: number;

    newThisMonth: number;

  };



  membership: {

    level: string;

    total: number;

  }[];



  growth: {

    month: string;

    total: number;

  }[];



  topCustomers: {

    customerId: string;

    name: string;

    totalSpent: number;

    transactionCount: number;

  }[];


}