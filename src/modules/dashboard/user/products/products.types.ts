// =========================
// USER DASHBOARD PRODUCT TYPES
// =========================


export interface UserDashboardProducts {


  overview: {

    total: number;

    active: number;

    inactive: number;

    lowStock: number;

  };



  categoryDistribution: {

    category: string;

    total: number;

  }[];



  topSellingProducts: {

    productId: string;

    name: string;

    quantity: number;

    revenue: number;

  }[];



  slowMovingProducts: {

    productId: string;

    name: string;

    stock: number;

    soldQuantity: number;

  }[];


}