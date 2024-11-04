import { NextFunction, Request, Response } from 'express';
import { User } from '../usecases/user';
import { authentication, random } from '../helpers/index';
import asyncHandler from "../middlewares/async";
import { IUser } from '../models/users';
import { ErrorResponse } from '../utils/errorResponse';
import { loginUser, registerUser } from '../validators/user';

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction ) => {
  const { error, value } = registerUser.validate(req.body);

  if (error) return next(new ErrorResponse(error.details[0].message, 400));


  const { email, password, username } = value;
  
  const existingUser = await User.userByEmail(email);
  if (existingUser) {
    throw new ErrorResponse("User already exists", 400);
  }
  // const salt = random();
  const user = await User.create(value);
  return res.status(201).json({success: true, message: 'User created successfully', data: user});
});


export const login = asyncHandler(async (req: Request, res: Response)=> {

  const { error, value } = loginUser.validate(req.body);

  if (error) {
    throw new ErrorResponse("Email and password is required", 400);
  }

  const { email, password } = value;
  
  // Check if user exists
  let user = await User.userByEmail(email) // .select("+authentication.salt +authentication.password");
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  // Authenticate user
  const expectHash = authentication(user.salt ?? "", password);
  if (!expectHash) {
    throw new ErrorResponse("Password is incorrect", 400);
  }

  // Update session token and save user
  const salt = random();
  user.sessionToken = authentication(salt, user._id.toString());
  await user.save();

  // Set cookie and return response
  res.cookie("token", user.sessionToken, {
    domain: "localhost",
    path: "/",
  });
  
  return res.status(200).json(user);
});


