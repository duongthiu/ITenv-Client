export type ErrorStatus = 400 | 401 | 403 | 404 | 409 | 500;

export interface ErrorResponse {
  success: false;
  message: string;
  status: ErrorStatus;
}

export const ERROR_MESSAGES: Record<ErrorStatus, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error'
};

export const getErrorMessage = (status: ErrorStatus): string => {
  return ERROR_MESSAGES[status] || 'An unexpected error occurred';
};

export const isErrorResponse = (error: any): error is ErrorResponse => {
  return (
    error &&
    typeof error === 'object' &&
    'success' in error &&
    'message' in error &&
    'status' in error &&
    error.success === false
  );
};
