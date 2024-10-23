import { Request, Response, NextFunction } from 'express';
import { get, merge } from 'lodash';
import { userBySessionToken } from '../usecases/user';
import asyncHandler from './async';

export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies['token']; // Correct usage
    if (!sessionToken) {
      return res.sendStatus(403);
    }
    const existingUser = await userBySessionToken(sessionToken);
    if (!existingUser) {
      return res.sendStatus(403);
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

// Middleware to verify ownership
export const isOwner = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id', '') as string;
    if (!currentUserId || currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }
    next(); // Ensure to call next to pass control to the next middleware
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});