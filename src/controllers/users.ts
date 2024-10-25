import { Request, Response } from "express";
import { User } from "../usecases/user";
import asyncHandler from '../middlewares/async';
import { ErrorResponse } from "../utils/errorResponse";

export const deletedUser = asyncHandler(async (req:Request, res:Response) => {
  const { id } = req.params;

  const deleteAUser = await User.deleteUser(id);

  return res.status(200).json({ messgae: "User has been deletes",deleteAUser })
})

export const updateUser = asyncHandler(async (req:Request, res:Response) => {
  const { id } = req.params;
  const { username } = req.body;

  if(!id || !username) {
    throw new ErrorResponse("Id and username is required", 400);
  }

  const user = await User.userById(id)

  if (!user) {
    throw new ErrorResponse("User cannot be found", 404);
  }

  user.username = username
  await user.save();

  return res.status(200).json({ message: "User has been updated",user });
})