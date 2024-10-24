import { UserRepository } from '../repository/user';
import { IUser } from '../models/users';
import { ErrorResponse } from '../utils/errorResponse';

export class User {
  // create a new user
  static async create(user:IUser) {
    try {
      return await UserRepository.createUser(user);
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get a user by email
  static async userByEmail(email:string) {
    try {
      return await UserRepository.getUserByEmail(email);
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get user by session token
  static async userBySessionToken(session:string) {
    try {
      return await UserRepository.getUserBySessionToken(session);
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get all users
  static async fetchUsers() {
    try {
      return await UserRepository.getUsers();
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // delete a user
  static async deleteUser(id:string) {
    try {
      return await UserRepository.deleteUser(id);
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // update a user
  static async update(id:string, update: IUser) {
    try {
      return await UserRepository.updateUser(id, update);
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get a user by id
  static async userById(id:string) {
    try {
      return await UserRepository.getUserById(id);
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }
};