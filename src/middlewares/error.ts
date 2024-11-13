import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ErrorResponse, ExtendedError } from '../utils/errorResponse';

const errorHandler: ErrorRequestHandler = (
  err: Error | ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Type cast to ExtendedError
  let error = err as ExtendedError;

  // If it's not an ErrorResponse instance, create a new one
  if (!(err instanceof ErrorResponse)) {
    error = new ErrorResponse(err.message || 'Server Error', 500) as ExtendedError;
  }

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack
  });

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message,
      statusCode: error.statusCode || 500,
      errors: 'errors' in error ? error.errors : null,
    },
  });
};

export default errorHandler;
