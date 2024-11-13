import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/users';
import { User } from '../usecases/user';
import asyncHandler from './async';
import { ErrorResponse } from '../utils/errorResponse';

// Extend Express Request type
declare module 'express' {
  export interface Request {
    user?: IUser;
  }
}

// Constants for authentication
const AUTH_CONSTANTS = {
  BEARER_PREFIX: 'Bearer ',
  COOKIE_NAME: 'token',
  ERROR_MESSAGES: {
    TOKEN_MISSING: 'Authentication token is required',
    USER_NOT_FOUND: 'User not found or session expired',
    UNAUTHORIZED: 'Unauthorized access',
    ADMIN_ONLY: 'Access denied. Administrator privileges required',
    INVALID_TOKEN: 'Invalid authentication token'
  }
} as const;

/**
 * Extracts token from request headers or cookies
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  
  if (authHeader?.startsWith(AUTH_CONSTANTS.BEARER_PREFIX)) {
    return authHeader.substring(AUTH_CONSTANTS.BEARER_PREFIX.length);
  }
  
  return req.cookies[AUTH_CONSTANTS.COOKIE_NAME] || null;
};

/**
 * Authentication middleware
 */
export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = extractToken(req);

  if (!token) {
    throw new ErrorResponse(AUTH_CONSTANTS.ERROR_MESSAGES.TOKEN_MISSING, 401);
  }

  const user = await User.userBySessionToken(token);

  if (!user) {
    throw new ErrorResponse(AUTH_CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND, 401);
  }

  // Attach user to request
  req.user = user;
  next();
});

/**
 * Resource ownership middleware
 */
export const isOwner = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const currentUserId = req.user?._id;

  if (!currentUserId) {
    throw new ErrorResponse(AUTH_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED, 401);
  }

  // Use strict equality comparison with toString()
  if (currentUserId.toString() !== id.toString()) {
    throw new ErrorResponse(AUTH_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED, 403);
  }

  next();
});

/**
 * Admin authorization middleware
 */
export const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    throw new ErrorResponse(AUTH_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED, 401);
  }

  if (req.user.role !== 'admin') {
    throw new ErrorResponse(AUTH_CONSTANTS.ERROR_MESSAGES.ADMIN_ONLY, 403);
  }

  next();
});