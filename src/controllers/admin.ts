import { Request, Response } from 'express';
import asyncHandler from '../middlewares/async';
import { User } from '../usecases/user';
import { ErrorResponse } from '../utils/errorResponse';

const checkRole = (email:string) => {

  if (!email) {
    throw new ErrorResponse("Id is required", 400)
  }

  const check = User.userByEmail(email)
  
  if (!check) {
    throw new ErrorResponse("User doesn't exist", 404);
  }

  return check.role;

}

export const getAllUsers = asyncHandler(async (req:Request, res:Response) => {
  
  const check = checkRole.toString()
  if (check !== 'admin') {
    throw new ErrorResponse("Only admins can get all users", 400);
  }  

  const user = await User.fetchUsers();

  return res.status(200).json({ message: "Here is all the users:", user });
});

