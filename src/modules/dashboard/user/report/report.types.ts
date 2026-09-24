// =========================
// USER DASHBOARD REPORT TYPES
// =========================


export interface UserDashboardReport {


  sales: {

    totalTransaction: number;

    totalRevenue: number;

    averageTransaction: number;

  };



  transactionStatus: {

    status: string;

    total: number;

  }[];



  customer: {

    totalCustomer: number;

    newCustomer: number;

    activeCustomer: number;

  };



  product: {

    totalProduct: number;

    activeProduct: number;

    lowStock: number;

  };



  inventory: {

    stock: number;

    stockValue: number;

  };


}