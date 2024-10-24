import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, ExtendedError } from '../utils/errorResponse';


export const errorHandler = (err: ErrorResponse | Error, req: Request, res: Response, next: NextFunction) => {
  
  let error: ExtendedError = err
  const statusCode = error.statusCode || 500;
  const errMessage = error.message || "Internal Server Error"

  return res.status(statusCode).json({
    success: false,
    message: errMessage
  });
}