export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: unknown[];
}

export interface PaginationMeta {

  page: number;

  limit: number;

  total: number;

  totalPages: number;

}