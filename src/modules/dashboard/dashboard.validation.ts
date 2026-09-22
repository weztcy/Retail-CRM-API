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

export const productAnalyticsSchema =
z.object({

  startDate:
    z.string()
    .datetime()
    .optional(),


  endDate:
    z.string()
    .datetime()
    .optional(),


  search:
    z.string()
    .optional(),


  sort:
    z.enum([

      "quantity_desc",

      "quantity_asc",

      "revenue_desc",

      "revenue_asc",

    ])
    .optional(),


  page:
    z.coerce.number()
    .int()
    .positive()
    .optional(),


  limit:
    z.coerce.number()
    .int()
    .positive()
    .max(100)
    .optional(),


});

export const customerAnalyticsSchema =
z.object({

  startDate:
    z.string()
    .datetime()
    .optional(),


  endDate:
    z.string()
    .datetime()
    .optional(),


  search:
    z.string()
    .optional(),


  membership:
    z.enum([

      "BRONZE",

      "SILVER",

      "GOLD",

      "PLATINUM",

    ])
    .optional(),


  sort:
    z.enum([

      "spent_desc",

      "spent_asc",

      "latest",

    ])
    .optional(),


  page:
    z.coerce.number()
    .positive()
    .optional(),


  limit:
    z.coerce.number()
    .positive()
    .max(100)
    .optional(),


});