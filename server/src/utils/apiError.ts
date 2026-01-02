interface ApiErrorInterface {
  statusCode: number;
  message: string;
  error: any;
  stack?: string;
}

class ApiError extends Error implements ApiErrorInterface {
  statusCode: number;
  message: string;
  error: any;
  stack?: string;

  constructor(statusCode: number, message: string, error: any, stack?: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
