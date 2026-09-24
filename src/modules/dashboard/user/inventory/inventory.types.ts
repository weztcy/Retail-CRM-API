// =========================
// USER DASHBOARD INVENTORY TYPES
// =========================


export interface UserDashboardInventory {


  // =========================
  // INVENTORY OVERVIEW
  // =========================

  overview: {

    totalStock: number;

    totalStockValue: number;

    lowStock: number;

    totalMovement: number;

  };



  // =========================
  // STOCK MOVEMENT
  // =========================

  movement: {

    type: string;

    quantity: number;

    totalTransaction: number;

  }[];



  // =========================
  // RECENT INVENTORY ACTIVITY
  // =========================

  recentActivity: {

    productId: string;

    productName: string;

    type: string;

    quantity: number;

    stockBefore: number;

    stockAfter: number;

    createdAt: Date;

  }[];




  // =========================
  // FAST MOVING PRODUCT
  // =========================

  fastMovingProducts: {

    productId: string;

    productName: string;

    totalOut: number;

  }[];





  // =========================
  // STOCK VALUE BY CATEGORY
  // NEW IMPROVEMENT
  // =========================

  stockValueByCategory: {

    category: string;

    totalStock: number;

    stockValue: number;

  }[];




}