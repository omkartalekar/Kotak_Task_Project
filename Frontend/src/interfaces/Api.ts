export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}
