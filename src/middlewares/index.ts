import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/users';
import { User } from '../usecases/user';
import asyncHandler from './async';
import { ErrorResponse } from '../utils/errorResponse';

declare module 'express' {
  export interface Request {
    user?: IUser; // Add the user property to the Request interface (allows TS know use req.user)
  }
}

export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers['authorization'];
    const sessionToken = authorizationHeader 
      ? authorizationHeader.split(" ")[1]  // Extract token from 'Bearer <token>'
      : req.cookies['token'];              // Fallback to cookie if header is absent

    console.log(sessionToken);

    if (!sessionToken) {
      throw new ErrorResponse("Session Token is missing", 403);
    }

    const existingUser = await User.userBySessionToken(sessionToken);

    console.log(existingUser);

    if (!existingUser) {
      throw new ErrorResponse("No user with this session token", 404);
    }

    req.user = existingUser; 
    return next();
  } catch (error: any) {
    console.log(error);
    throw new ErrorResponse(error.message, 500);
  }
});

// Middleware to verify ownership
export const isOwner = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id;

    if (!currentUserId || currentUserId.toString() !== id) {
      throw new ErrorResponse("User doesn't own the account", 403);
    }
    return next();
  } catch (error: any) {
    console.log(error);
    throw new ErrorResponse(error.message, 500);
  }
});

// Middleware to check if user is an admin
export const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      throw new ErrorResponse("Access denied. Admins only.", 403);
    }
    return next();
  } catch (error: any) {
    console.log(error);
    throw new ErrorResponse(error.message, 500);
  }
});
