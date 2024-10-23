import { Request, Response } from "express";
import { deleteUser, fetchUser, userById } from "../usecases/user";
import asyncHandler from '../middlewares/async';

export const getAllUsers = asyncHandler(async (req:Request, res:Response) => {
  try {
    const user = await fetchUser();

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

export const deletedUser = asyncHandler(async (req:Request, res:Response) => {
  try {
    const { id } = req.params;

    const deleteAUser = await deleteUser(id);

    return res.json(deleteAUser)
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
})

export const updateUser = asyncHandler(async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if(!id || !username) {
      return res.sendStatus(400)
    }

    const user = await userById(id)

    if (!user) {
      return res.sendStatus(400);
    }

    user.username = username
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
})