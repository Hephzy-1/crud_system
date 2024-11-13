// repository/user.ts
import { ErrorResponse } from '../utils/errorResponse';
import User from '../models/users';
import { IUser } from '../models/users';
import { Types } from 'mongoose';
import { hashPassword } from '../helpers';

interface CreateUserInput {
  username: string;
  email: string;
  role?: 'user' | 'admin';
  password?: string;
  sessionToken?: string;
  googleId?: string;
}

export class UserRepository {
  static async createUser(values: CreateUserInput): Promise<IUser> {
    try {
      const hash = values.password ? await hashPassword(values.password) : undefined;

      const user = await new User({
        ...values,
        password: hash,
        email: values.email.toLowerCase(),
      }).save();

      return user.toObject();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ErrorResponse('Email already exists', 400);
      }
      throw new ErrorResponse(error.message, 500);
    }
  }

  static async getUsers(): Promise<IUser[]> {
    return User.find().sort({ createdAt: -1 }).exec();
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() })
      .select('+salt +password')
      .exec();
  }

  static async getUserBySessionToken(sessionToken: string): Promise<IUser | null> {
    return User.findOne({ sessionToken }).exec();
  }

  static async getUserById(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ErrorResponse('Invalid user ID', 400);
    }
    return User.findById(id).exec();
  }

  static async updateUser(id: string, update: Partial<IUser>): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ErrorResponse('Invalid user ID', 400);
    }

    // Remove sensitive fields from update
    const sanitizedUpdate = { ...update };
    delete sanitizedUpdate.password;
    delete sanitizedUpdate.salt;

    return User.findByIdAndUpdate(
      id,
      { $set: sanitizedUpdate },
      { new: true, runValidators: true }
    ).exec();
  }

  static async updateUserPosts(userId: Types.ObjectId, postId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new ErrorResponse('Invalid post ID', 400);
    }

    const result = await User.updateOne(
      { _id: userId },
      { $addToSet: { posts: postId } }  // Use addToSet to prevent duplicates
    );

    return result.modifiedCount > 0;
  }

  static async deleteUser(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ErrorResponse('Invalid user ID', 400);
    }
    return User.findByIdAndDelete(id).exec();
  }
}
