import {
  z,
} from "zod";


export const dashboardFilterSchema = z.object({

  startDate:
    z.string()
    .datetime()
    .optional(),


  endDate:
    z.string()
    .datetime()
    .optional(),

});