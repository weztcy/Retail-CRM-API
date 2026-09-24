// =========================
// USER DASHBOARD INVENTORY TYPES
// =========================


export interface UserDashboardInventory {


  overview: {

    totalStock: number;

    totalStockValue: number;

    lowStock: number;

    totalMovement: number;

  };



  movement: {

    type: string;

    quantity: number;

    totalTransaction: number;

  }[];



  recentActivity: {

    productId: string;

    productName: string;

    type: string;

    quantity: number;

    stockBefore: number;

    stockAfter: number;

    createdAt: Date;

  }[];



  fastMovingProducts: {

    productId: string;

    productName: string;

    totalOut: number;

  }[];


}