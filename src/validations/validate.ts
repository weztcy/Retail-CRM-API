import { ZodSchema } from "zod";
import { ApiError } from "@/utils/errors/api-error";


export function validate<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {

  const result = schema.safeParse(data);


  if (!result.success) {

    throw new ApiError(
      "Validation Error",
      400,
      result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
    );

  }


  return result.data;

}