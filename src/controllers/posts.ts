import { Request, Response } from "express";
import { Post } from "../usecases/posts";
import { User } from "../usecases/user";
import asyncHandler from '../middlewares/async';
import { IPost } from "../models/posts";
import { ErrorResponse } from "../utils/errorResponse";
import { makePost } from "../validators/post";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  req.body.userId = req.user?._id;
  console.log(req.body)
  const { error, value } = makePost.validate(req.body);

  if (error) {
    throw new ErrorResponse("Title and post is required", 400);
  }

  const { title, post } = value;

  value.userId = req.body.userId
  console.log(value)

  const user = User.userById(value.userId)

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  const blog = await Post.create(value);
  return res.status(201).json({ Message: "Post has been created: ", blog})
});