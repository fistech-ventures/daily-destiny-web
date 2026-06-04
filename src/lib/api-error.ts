export class ApiError extends Error {
  statusCode: number;
  retryAfter?: number; // seconds, from 429 Retry-After header

  constructor(statusCode: number, message: string, retryAfter?: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.retryAfter = retryAfter;

    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
