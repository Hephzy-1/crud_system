import { ErrorResponse } from "../utils/errorResponse";
import { IPost } from "../models/posts";
import Post from "../models/posts";

export class PostRepository {
  // Create a new post
  static async createPost (values:IPost) {
    try {
      const post = await new Post(values)

      post.save()
      return post.toObject()
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get all posts
  static async getPosts () {
    try {
      return await Post.find().exec();
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get all posts by a specific user
  static async getPostByUserId (userId: string) {
    try {
      const user = await Post.find({ userId: userId})  //.populate('userId');

      console.log(user)
      return user;
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // get post by its id
  static async getPostById (id: string) {
    try {
      return await Post.findById(id);
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // update a post
  static async updatePost (id: string, update: Partial<IPost>) {
    try {
      if (Post.findById(id) === null) {
        throw new ErrorResponse("Post not found", 404);
      }

      return await Post.findOneAndUpdate({_id:id}, update, { new: true }).exec();

    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // delete a post
  static async deletePost (id: string) {
    try {
      return await Post.findOneAndDelete({ _id: id })
    } catch (error:any) {
      throw new ErrorResponse(error.message, 500);
    }
  }
}