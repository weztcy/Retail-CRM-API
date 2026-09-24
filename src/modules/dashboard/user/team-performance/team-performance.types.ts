export interface TeamPerformanceDashboard {


  overview: {

    totalStaff:number;

    totalRevenue:number;

    totalTransaction:number;

    averageRevenue:number;

  };



  ranking: {

    userId:string;

    name:string;

    role:string;

    transaction:number;

    revenue:number;

    customer:number;

  }[];



  topProducts: {

    userName:string;

    productName:string;

    quantity:number;

  }[];


}