export interface ErrorResponse {
  status?: number;
  data?: {
    message?: string;
    error?: string;
    [key: string]: unknown;
  };
  headers?: {
    [key: string]: string;
  };
  [key: string]: unknown;
}

export interface ApiError extends Error {
  code?: string;
  message: string;
  response?: ErrorResponse;
  request?: unknown;
  config?: unknown;
}

export interface BackendErrorData {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export interface BackendErrorResponse {
  status?: number;
  data?: BackendErrorData;
  headers?: {
    [key: string]: string;
  };
  [key: string]: unknown;
}

export interface TypedApiError extends Error {
  code?: string;
  message: string;
  response?: BackendErrorResponse;
  request?: unknown;
  config?: unknown;
}

export interface HandleApiErrorOptions {
  error: TypedApiError | null | undefined;
}

export interface LogErrorToService {
  (error: TypedApiError | null | undefined): void;
}

export interface ValidationErrors {
  [field: string]: string;
}


export interface IsRecoverableError {
  (error: TypedApiError | null | undefined): boolean;
}

export interface GetRetryDelayError {
  response?: {
    status?: number;
    headers?: {
      [key: string]: string;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}