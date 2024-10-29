import { Request, Response } from "express";
import { Post } from "../usecases/posts";
import asyncHandler from '../middlewares/async';
import { IPost } from "../models/posts";
import { ErrorResponse } from "../utils/errorResponse";
import { makePost } from "../validators/post";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = makePost.validate(req.body);

  if (error) {
    throw new ErrorResponse("Title and post is required", 400);
  }

  const { title, post } = value;

  const blog = await Post.create(value);
  return res.status(201).json({ Message: "Post has been created: ", blog})
});