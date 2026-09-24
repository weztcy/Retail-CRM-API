// =========================
// CUSTOMER RECOMMENDATION TYPES
// =========================


export interface CustomerRecommendation {


  recommendations: {


    productId:string;


    productName:string;


    category:string;


    price:number;


    reason:string;


  }[];


}