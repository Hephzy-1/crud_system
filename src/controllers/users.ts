import { Request, Response } from "express";
import { deleteUserById, getUser } from "db/users";

export const getAllUsers = async (req:Request, res:Response) => {
  try {
    const user = await getUser();

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;

    const deleteAUser = await deleteUserById(id);

    return res.json(deleteAUser)
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
