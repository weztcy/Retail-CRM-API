export interface DashboardFilter {
  startDate?: Date;

  endDate?: Date;
}

export interface ProductAnalyticsFilter 
extends DashboardFilter {

  search?: string;

  sort?:
    | "quantity_desc"
    | "quantity_asc"
    | "revenue_desc"
    | "revenue_asc";

  page?: number;

  limit?: number;

}

export interface CustomerAnalyticsFilter 
extends DashboardFilter {

  search?: string;

  membership?:
    | "BRONZE"
    | "SILVER"
    | "GOLD"
    | "PLATINUM";


  sort?:
    | "spent_desc"
    | "spent_asc"
    | "latest";


  page?: number;

  limit?: number;

}