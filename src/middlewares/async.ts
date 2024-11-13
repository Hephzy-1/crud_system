import { Request, Response, NextFunction, RequestHandler } from "express";

// Define a more specific type for the async function
type AsyncRequestHandler<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

/**
 * Wraps an async request handler to properly handle promises and catch errors
 * @param fn The async request handler function to wrap
 * @returns A wrapped request handler that properly catches errors
 */
const asyncHandler = <T>(
  fn: AsyncRequestHandler<T>
): RequestHandler => 
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
