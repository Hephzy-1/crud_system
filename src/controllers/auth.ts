import { NextFunction, Request, Response } from 'express';
import { User } from '../usecases/user';
import { comparePassword, authentication } from '../helpers/index';
import asyncHandler from "../middlewares/async";
import passport from 'passport';
import { ErrorResponse } from '../utils/errorResponse';
import { loginUser, registerUser } from '../validators/user';

export const register = async (req: Request, res: Response, next: NextFunction ) => {
  const { error, value } = registerUser.validate(req.body);

  if (error) return next(new ErrorResponse(error.details[0].message, 400));


  const { email, password, username } = value;
  
  const existingUser = await User.userByEmail(email);
  if (existingUser) {
    next (new ErrorResponse("User already exists", 400));
  }
  
  const user = await User.create(value);
  return res.status(201).json({success: true, message: 'User created successfully', data: user});
};


export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const { error, value } = loginUser.validate(req.body);

  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const { email, password } = value;

  // Check if user exists
  let user = await User.userByEmail(email); 

  if (!user || !user.password) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Ensure salt is defined
  if (!user.salt) {
    return next(new ErrorResponse("Authentication error", 500));
  }

  // Authenticate user
  const expectHash = await comparePassword(password, user.password);
  if (!expectHash) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Update session token and save user
  user.sessionToken = authentication(user.salt, user._id.toString());
  await user.save();

  return res.status(200).json({ success: true, message: "User has successfully logged in", data: user });
});

export function oAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('google', { scope: ['profile', 'email'], session: false }, async (err: any, user: any, info: any) => {
    if (err) {
      console.error('Error during authentication:', err);
      throw next(new ErrorResponse('Authentication failed', 400));
    }
    if (!user) {
      console.log('No user found:', info);
      throw next(new ErrorResponse('Authentication failed', 404));
    }

    try {
      // Extract email and name from the authenticated user (assuming it's provided by Google)
      const email = user.email;
      const username = user.username;

      // Ensure email and name exist
      if (!email || !username) {
        throw next(new ErrorResponse('Missing email or name from user data', 400));
      }

      // Update session token and save user
      user.sessionToken = authentication(user.salt, user._id.toString());
      await user.save();

      // Respond with the JWT and email result
      return res.json({ message: 'Authentication successful', data: user });

    } catch (err: any) {
      throw next(new ErrorResponse(err.message, 500))
    }
  })(req, res, next);
};
