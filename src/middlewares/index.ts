import { Request, Response, NextFunction } from 'express';
import { get, merge } from 'lodash';
import { User } from '../usecases/user';
import asyncHandler from './async';
import { ErrorResponse } from '../utils/errorResponse';

export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies['token']; // Correct usage
    if (!sessionToken) {
      throw new ErrorResponse("Session Token is missing", 403);
    }
    const existingUser = await User.userBySessionToken(sessionToken);
    if (!existingUser) {
      throw new ErrorResponse("No user with this session token", 404);
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error:any) {
    console.log(error);
    throw new ErrorResponse(error.message, 500);
    ;
  }
});

// Middleware to verify ownership
export const isOwner = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id', '') as string;
    if (!currentUserId || currentUserId.toString() !== id) {
      throw new ErrorResponse("User doesn't own the account", 403);
    }
    next(); // Ensure to call next to pass control to the next middleware
  } catch (error:any) {
    console.log(error);
    throw new ErrorResponse(error.message, 500);
  }
});