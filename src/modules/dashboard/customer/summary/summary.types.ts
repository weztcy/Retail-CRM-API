// =========================
// CUSTOMER DASHBOARD SUMMARY TYPES
// =========================


export interface CustomerDashboardSummary {


  overview: {

    customerName: string;

    membership: string;

    totalSpent: number;

    totalTransaction: number;

    loyaltyPoints: number;

  };



  lastTransaction: {

    invoiceNumber: string;

    amount: number;

    date: Date;

  } | null;




  favoriteProduct: {

    productName: string;

    totalPurchase: number;

  } | null;




  customerSince: Date;


}