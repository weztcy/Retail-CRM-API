export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;



export const API_MESSAGES = {
  SUCCESS: "Success",
  CREATED: "Created",
  UPDATED: "Updated",
  DELETED: "Deleted",
  NOT_FOUND: "Data not found",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  VALIDATION_ERROR: "Validation Error",
  INTERNAL_ERROR: "Internal Server Error",
} as const;