import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, ExtendedError } from '../utils/errorResponse';


function errorHandler(
  err: ErrorResponse | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  let error: ExtendedError = err;

  if (!(err instanceof ErrorResponse)) {
    error = new ErrorResponse(err.message || 'Server Error', 500);
  }
  console.log(error.statusCode)
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message,
      statusCode: error.statusCode || 500,
      errors: 'errors' in error ? error.errors : null,
    },
  });
}

export default errorHandler;