import { Request, Response } from 'express';
import { registerUser, userByEmail } from '../usecases/user';
import { authentication, random } from '../helpers/index';
import asyncHandler from "../middlewares/async";
import { IUser } from '../models/users';

export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }
    const existingUser = await userByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }
    const salt = random();
    const user = await registerUser(req.body);
    return res.status(201).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});


export const login = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    
    // Check if user exists
    let user = await userByEmail(email).select("+authentication.salt +authentication.password") as IUser | null;
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Authenticate user
    const expectHash = authentication(user.authentication.salt ?? "", password);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Update session token and save user
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());
    await user.save();

    // Set cookie and return response
    res.cookie("token", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});


