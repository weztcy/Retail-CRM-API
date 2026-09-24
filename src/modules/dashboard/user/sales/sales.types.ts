// =========================
// USER DASHBOARD SALES TYPES
// =========================


export interface UserDashboardSales {


  overview: {

    today: number;

    month: number;

    averageTransaction: number;

  };



  trend: {

    month: string;

    sales: number;

    transaction: number;

  }[];



  paymentMethod: {

    method: string;

    total: number;

    amount: number;

  }[];



  topProducts: {

    productId: string;

    productName: string;

    quantity: number;

    sales: number;

  }[];


}