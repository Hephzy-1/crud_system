import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler = (
  fn: RequestHandler
) => 
  (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(fn(req, res, next))
      .catch((error: unknown) => {
        // Ensure we're passing an Error object to next()
        if (error instanceof Error) {
          next(error);
        } else {
          next(new Error(typeof error === 'string' ? error : 'Unknown error occurred'));
        }
      });
  };

export default asyncHandler;
