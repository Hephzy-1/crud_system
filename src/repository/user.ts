import User from '../models/users';
import { IUser } from '../models/users';

export const getUser = () => User.find();
export const getUserByEmail = (email: string) => {
  return User.findOne({ email }).select('+authentication.salt +authentication.password');
};

export const getUserBySessionToken = (sessionToken: string) => User.findOne({ 'authentication.sessionToken': sessionToken});
export const getUserById = (id: string) => User.findById(id);
export const createUser = async (values: IUser): Promise<IUser> => {
  const user = await new User(values).save();
  return user.toObject();
};

export const updateUser = (id: string, values: Record<string, any>) => User.findByIdAndUpdate(id
  , values, { new: true });
export const deleteUserById = (id: string) => User.findOneAndDelete({_id: id})