// =========================
// USER DASHBOARD LOYALTY TYPES
// =========================


export interface UserDashboardLoyalty {


  overview: {

    totalMember: number;

    totalPoints: number;

    averagePoints: number;

    activeMember: number;

  };



  pointActivity: {

    type: string;

    totalPoints: number;

    totalTransaction: number;

  }[];



  topCustomers: {

    customerId: string;

    customerName: string;

    membership: string;

    points: number;

  }[];



  trend: {

    month: string;

    points: number;

  }[];


}