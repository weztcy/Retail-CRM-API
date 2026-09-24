// =========================
// CUSTOMER PURCHASE TYPES
// =========================


export interface CustomerPurchaseAnalytics {


  overview: {

    totalTransaction: number;

    totalSpent: number;

    averageTransaction: number;

  };



  spendingTrend: {

    month: string;

    spent: number;

  }[];



  favoriteCategory: {

    category: string;

    totalPurchase: number;

  }[];



  favoriteProduct: {

    productId: string;

    productName: string;

    quantity: number;

  }[];


}