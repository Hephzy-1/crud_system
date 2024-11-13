// controllers/auth.ts
import { NextFunction, Request, Response } from 'express';
import { User } from '../usecases/user';
import { comparePassword, authentication } from '../helpers/index';
import asyncHandler from "../middlewares/async";
import passport from 'passport';
import { ErrorResponse } from '../utils/errorResponse';
import { loginUser, registerUser } from '../validators/user';

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = registerUser.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const user = await User.create(value);
  
  // Remove sensitive data
  const userData = { ...user };
  delete userData.password;
  delete userData.salt;

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: userData
  });
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = loginUser.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const { email, password } = value;

  const user = await User.userByEmail(email);
  if (!user || !user.password) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (!user.salt) {
    return next(new ErrorResponse('Authentication error', 500));
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  user.sessionToken = authentication(user.salt, user._id.toString());
  await user.save();

  // Remove sensitive data
  const userData = user.toJSON();

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: userData
  });
});

export const oAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { scope: ['profile', 'email'], session: false }, async (err: any, user: any, info: any) => {
    if (err) {
      return next(new ErrorResponse('Authentication failed', 500));
    }

    if (!user) {
      return next(new ErrorResponse('Authentication failed', 401));
    }

    try {
      const { email, username } = user;
      
      if (!email || !username) {
        return next(new ErrorResponse('Missing required user data', 400));
      }

      user.sessionToken = authentication(user.salt, user._id.toString());
      await user.save();

      const userData = user.toJSON();

      res.status(200).json({
        success: true,
        message: 'OAuth login successful',
        data: userData
      });
    } catch (error: any) {
      next(new ErrorResponse(error.message, 500));
    }
  })(req, res, next);
});
