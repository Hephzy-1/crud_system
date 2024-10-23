import { createUser, deleteUserById, getUser, getUserByEmail, getUserById, getUserBySessionToken, updateUser } from '../repository/user';
import { IUser } from '../models/users';

export const registerUser = async (user: IUser): Promise<IUser> => {
  try {
    return await createUser(user);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const userByEmail = (email: string) => {
  return getUserByEmail(email);
};

export const userBySessionToken = async (session: string) => {
  return await getUserBySessionToken(session)
}

export const fetchUser = async () => {
  return await getUser()
}

export const deleteUser = async (id:string) => {
  return await deleteUserById(id)
}

export const update = async (id:string, update:IUser) => {
  try {
    return await updateUser(id, update)
  } catch (error:any) {
    throw new Error(error.message)
  }
}

export const userById = async(id:string) => {
  try {
    return await getUserById(id)
  } catch (error:any) {
    throw new Error(error.message)
  }
}