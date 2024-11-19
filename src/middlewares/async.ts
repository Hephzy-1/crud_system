import { Request, Response, NextFunction } from "express";

type AsyncFunction<T> = (req: Request, res: Response, next: NextFunction) => Promise<T>;

const asyncHandler = (fn: AsyncFunction<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;