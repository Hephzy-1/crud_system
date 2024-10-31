import { Request, Response } from "express";
import { Post } from "../usecases/posts";
import { User } from "../usecases/user";
import asyncHandler from '../middlewares/async';
import { IPost } from "../models/posts";
import { ErrorResponse } from "../utils/errorResponse";
import { makePost, userPost, updatePost } from "../validators/post";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  req.body.userId = req.user?._id;
  console.log(req.body)
  const { error, value } = makePost.validate(req.body);

  if (error) {
    throw new ErrorResponse("Title and post is required", 400);
  }

  const { title, post } = value;

  value.userId = req.body.userId

  const user = User.userById(value.userId)

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  const blog = await Post.create(value);
  return res.status(201).json({ Message: "Post has been created: ", blog})
});

export const getPostsByUserId = asyncHandler(async (req: Request, res: Response) => {
  try {

    const { error, value } = userPost.validate(req.params);

    if (error) {
      throw new ErrorResponse("User ID is required", 400);
    }

    const { id } = value;

    const post = await Post.postByUserId(id)
    if (!post) {
      throw new ErrorResponse("Post not found", 404);
    }
    res.status(200).json({ post });
  } catch (error:any) {
    throw new ErrorResponse(error.message, 500);
  }
});

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  try { 
    const post = await Post.getPosts();

    return res.status(200).json({ message: "Here is all the posts:", post })
  } catch (error:any) {
    throw new ErrorResponse(error.message, 500)
  }
});

export const update = asyncHandler(async (req:Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = updatePost.validate(req.body)

    if (error) {
      throw new ErrorResponse("post update is required", 400);
    }

    const { update } = value;

    const pushUpdate = await Post.update(id, update)

    return res.status(200).json({ message: "Post has been updated", post: pushUpdate });
  } catch (error: any) {
    throw new ErrorResponse(error.message, 500);
  }
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Post.delete(id)

    return res.status(200).json({ message: "Successfully deleted post", success: deleted})
  } catch (error: any) {
    throw new ErrorResponse(error.message, 500)
  }
})