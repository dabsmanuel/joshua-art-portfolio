import { ErrorResponse, ApiError , BackendErrorData, BackendErrorResponse, TypedApiError, HandleApiErrorOptions, LogErrorToService, ValidationErrors, IsRecoverableError, GetRetryDelayError} from "@/types/error";

/**
 * Centralized error handling utility
 * Handles different types of errors and returns user-friendly messages
 */

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

// Error messages mapping
const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT: 'Request timeout. Please try again.',
  
  // Authentication errors
  UNAUTHORIZED: 'Invalid credentials. Please check your email and password.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_TOKEN: 'Invalid authentication token. Please log in again.',
  
  // Authorization errors
  FORBIDDEN: 'You do not have permission to perform this action.',
  
  // Validation errors
  VALIDATION_FAILED: 'Please check your input and try again.',
  MISSING_FIELDS: 'Please fill in all required fields.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
  
  // Server errors
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
  
  // User-specific errors
  USER_EXISTS: 'User already exists with this email or username.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  
  // Generic
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

/**
 * Extract error type from error object
 * @param {Error} error - The error object
 * @returns {string} - Error type
 */

export const getErrorType = (error: ApiError | null | undefined): string => {
  if (!error) return ERROR_TYPES.UNKNOWN;

  // Network errors
  if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    return ERROR_TYPES.NETWORK;
  }

  // Axios errors
  if (error.response) {
    const status = error.response.status;
    
    switch (status) {
      case 400:
        return ERROR_TYPES.VALIDATION;
      case 401:
        return ERROR_TYPES.AUTHENTICATION;
      case 403:
        return ERROR_TYPES.AUTHORIZATION;
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return ERROR_TYPES.VALIDATION;
      case 429:
        return 'RATE_LIMIT';
      case 500:
      case 502:
      case 503:
      case 504:
        return ERROR_TYPES.SERVER;
      default:
        return ERROR_TYPES.UNKNOWN;
    }
  }

  // Request errors (no response received)
  if (error.request) {
    return ERROR_TYPES.NETWORK;
  }

  return ERROR_TYPES.UNKNOWN;
};

/**
 * Get user-friendly error message
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */


export const getErrorMessage = (error: TypedApiError | null | undefined): string => {
  if (!error) return ERROR_MESSAGES.UNKNOWN_ERROR;

  // Check if error has a custom message from the backend
  const backendMessage = error.response?.data?.message || error.response?.data?.error;
  
  if (backendMessage) {
    // Map common backend messages to user-friendly ones
    const messageMapping: { [key: string]: string } = {
      'User already exists with this email or username': ERROR_MESSAGES.USER_EXISTS,
      'Invalid credentials': ERROR_MESSAGES.INVALID_CREDENTIALS,
      'User not found': ERROR_MESSAGES.USER_NOT_FOUND,
      'Invalid refresh token': ERROR_MESSAGES.TOKEN_EXPIRED,
      'Refresh token required': ERROR_MESSAGES.TOKEN_EXPIRED,
      'Validation failed': ERROR_MESSAGES.VALIDATION_FAILED,
    };

    return messageMapping[backendMessage] || backendMessage;
  }

  // Handle different error types
  const errorType = getErrorType(error);
  const status = error.response?.status;

  switch (errorType) {
    case ERROR_TYPES.NETWORK:
      return ERROR_MESSAGES.NETWORK_ERROR;
    
    case ERROR_TYPES.AUTHENTICATION:
      if (status === 401) {
        return ERROR_MESSAGES.UNAUTHORIZED;
      }
      return ERROR_MESSAGES.INVALID_TOKEN;
    
    case ERROR_TYPES.AUTHORIZATION:
      return ERROR_MESSAGES.FORBIDDEN;
    
    case ERROR_TYPES.VALIDATION:
      return ERROR_MESSAGES.VALIDATION_FAILED;
    
    case ERROR_TYPES.SERVER:
      if (status === 503) {
        return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
      }
      return ERROR_MESSAGES.SERVER_ERROR;
    
    case 'NOT_FOUND':
      return 'The requested resource was not found.';
    
    case 'CONFLICT':
      return 'A conflict occurred. The resource may already exist.';
    
    case 'RATE_LIMIT':
      return 'Too many requests. Please wait a moment and try again.';
    
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

/**
 * Main error handler function
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */


export const handleApiError = (error: TypedApiError | null | undefined): string => {
  const errorMessage = getErrorMessage(error);

  // Log error for debugging (in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      config: error?.config,
    });
  }

  // Log to external service in production
  if (process.env.NODE_ENV === 'production') {
    logErrorToService(error);
  }

  return errorMessage;
};

/**
 * Log error to external service (e.g., Sentry, LogRocket)
 * @param {Error} error - The error object
 */

const logErrorToService: LogErrorToService = (error) => {
  // Example: Send to Sentry
  // Sentry.captureException(error);
  
  // Example: Send to custom logging service
  // loggerService.error(error);
  
  console.error('Production error:', error);
};

/**
 * Handle validation errors specifically
 * @param {Object} validationErrors - Validation errors object
 * @returns {string} - Formatted validation error message
 */

export const handleValidationErrors = (validationErrors: ValidationErrors | null | undefined): string => {
  if (!validationErrors || typeof validationErrors !== 'object') {
    return ERROR_MESSAGES.VALIDATION_FAILED;
  }

  const errorFields = Object.keys(validationErrors);
  if (errorFields.length === 1) {
    return validationErrors[errorFields[0]];
  }

  return `Please fix the following: ${errorFields.join(', ')}`;
};

/**
 * Check if error is recoverable (user can retry)
 * @param {Error} error - The error object
 * @returns {boolean} - Whether the error is recoverable
 */


export const isRecoverableError: IsRecoverableError = (error) => {
  const errorType = getErrorType(error);
  const status = error?.response?.status;

  // Network errors and server errors are usually recoverable
  if (errorType === ERROR_TYPES.NETWORK || errorType === ERROR_TYPES.SERVER) {
    return true;
  }

  // Rate limiting is recoverable
  if (status === 429) {
    return true;
  }

  // Authentication errors might be recoverable if user can re-login
  if (errorType === ERROR_TYPES.AUTHENTICATION) {
    return true;
  }

  return false;
};

/**
 * Get retry delay based on error type
 * @param {Error} error - The error object
 * @param {number} attempt - Current retry attempt
 * @returns {number} - Delay in milliseconds
 */

export const getRetryDelay = (
  error: GetRetryDelayError,
  attempt: number = 1
): number => {
  const status = error.response?.status;

  // Rate limiting - longer delay
  if (status === 429) {
    const retryAfter = error.response?.headers?.['retry-after'];
    return retryAfter ? parseInt(retryAfter) * 1000 : 60000; // 1 minute default
  }

  // Server errors - exponential backoff
  if (status !== undefined && status >= 500) {
    return Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Max 30 seconds
  }

  // Network errors - fixed delay
  return 3000; // 3 seconds
};

export default {
  handleApiError,
  getErrorType,
  getErrorMessage,
  handleValidationErrors,
  isRecoverableError,
  getRetryDelay,
  ERROR_TYPES,
};