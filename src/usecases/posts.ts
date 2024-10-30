import { PostRepository } from "../repository/posts";
import { UserRepository } from "../repository/user";
import { IPost } from "../models/posts";
import { ErrorResponse } from "../utils/errorResponse";
import { Types } from 'mongoose';

export class Post {
  // create a new post
  static async create(post: IPost): Promise<IPost> {
    try {
      let userId: Types.ObjectId = new Types.ObjectId(post.userId);
  
      // If no userId is found
      if (!userId) {
        console.error("User ID not found");
        throw new ErrorResponse("Error couldn't connect user to post", 500);
      }
  
      // create the post with the user ids
      post.userId = userId;
      const newPost = await PostRepository.createPost(post);
      await UserRepository.updateUserPost(userId, newPost._id as unknown as string);
  
      return newPost;
    } catch (error: any) {
      console.error(error.message);
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get all posts
  static async getPosts () {
    try {
      return await PostRepository.getPosts();
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get all posts by a specific user
  static async postByUserId(userId: string) {
    try {
      return await PostRepository.getPostByUserId(userId);
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get post by its id
  static async postById (id: string) {
    try {
      return await PostRepository.getPostById(id);
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // update a post
  static async update(id: string, update: IPost) {
    try {
      return await PostRepository.updatePost(id, update)
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // delete a post
  static async delete(id: string) {
    try {
      return await PostRepository.deletePost(id)
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }
}