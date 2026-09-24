// =========================
// USER DASHBOARD AUDIT TYPES
// =========================


export interface UserDashboardAudit {


  overview: {

    totalActivity: number;

    todayActivity: number;

    activeUser: number;

  };



  moduleActivity: {

    module: string;

    total: number;

  }[];



  actionActivity: {

    action: string;

    total: number;

  }[];



  recentActivity: {

    id: string;

    userName: string;

    module: string;

    action: string;

    description: string | null;

    createdAt: Date;

  }[];


}