export interface ErrorResponse {
  status?: number;
  data?: {
    message?: string;
    error?: string;
    [key: string]: any;
  };
  headers?: {
    [key: string]: string;
  };
  [key: string]: any;
}

export interface ApiError extends Error {
  code?: string;
  message: string;
  response?: ErrorResponse;
  request?: any;
  config?: any;
  [key: string]: any;
}

export interface BackendErrorData {
  message?: string;
  error?: string;
  [key: string]: any;
}

export interface BackendErrorResponse {
  status?: number;
  data?: BackendErrorData;
  headers?: {
    [key: string]: string;
  };
  [key: string]: any;
}

export interface TypedApiError extends Error {
  code?: string;
  message: string;
  response?: BackendErrorResponse;
  request?: any;
  config?: any;
  [key: string]: any;
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
    [key: string]: any;
  };
  [key: string]: any;
}