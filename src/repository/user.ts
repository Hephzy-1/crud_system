import { ErrorResponse } from '../utils/errorResponse';
import User from '../models/users';
import { IUser } from '../models/users';

export class UserRepository {
  // create a new user
  static async createUser(values:IUser) {
    try {
      const user = await new User(values).save();
      return user.toObject();

    } catch (error:any) {
      throw new ErrorResponse(error.message, 500)
    }
  }

  // get all users
  static async getUsers() {
    try {
      return await User.find().exec()
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500)
    }
  }

  // get a user by email
  static async getUserByEmail(email:string) {
    try {
      return await User.findOne({ email }).select('+authentication.salt +authentication.password')
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500)
    }
  }

  // get user by user session token
  static async getUserBySessionToken(sessionToken: string) {
    try {
      return await User.findOne({ 'authentication.sessionToken': sessionToken })
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500)
    }
  }

  // get user by id
  static async getUserById(id: string) {
    try {
      return await User.findById(id);
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500)
    }
  }

  // update user details
  static async updateUser(id: string, update: Partial<IUser>) {
    try {

      if (User.findById(id) === null) {
        throw new ErrorResponse("User not found", 404)
      }

      return await User.findOneAndUpdate({id}, update, { new: true }).exec()
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500)
    }
  }

  // delete a user
  static async deleteUser(id: string) {
    try {
      return await User.findOneAndDelete({_id: id})
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500)
    }
  }
}