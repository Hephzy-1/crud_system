import { Request, Response } from "express";
import { Post } from "../usecases/posts";
import { User } from "../usecases/user";
import asyncHandler from '../middlewares/async';
import { IPost } from "../models/posts";
import { ErrorResponse } from "../utils/errorResponse";
import { makePost, userPost, updatePost } from "../validators/post";
import upload from '../utils/multer';
import cloudinary from '../utils/cloudinary';

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  req.body.userId = req.user?._id;

  if (!req.body.userId) {
    throw new ErrorResponse("User ID is required", 400);
  }
  
  // Handle Multer upload with a Cloudinary upload for coverImage
  upload.single('coverImage')(req, res, async (err) => {
    if (err) throw new ErrorResponse(err.message, 500);

    try {
      // Validate and process the post input data
      // const { error, value } = makePost.validate(req.body);
      // if (error) {
      //   throw new ErrorResponse("Title, cover image and post content are required", 400);
      // }

      // const { title, post } = value;
      // value.userId = req.body.userId;

      // Check if user exists
      const user = await User.userById(req.body.userId);
      if (!user) {
        throw new ErrorResponse("User not found", 404);
      }

      // Upload image to Cloudinary and attach URL to the coverImage field
      if (req.file) {
        const uploadResult = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (cloudErr, result) => {
            if (cloudErr) throw new ErrorResponse("Image upload failed", 500);

            req.body.coverImage = result?.secure_url; // Set Cloudinary URL as coverImage
          }
        );
        uploadResult.end(req.file.buffer); // Pass file buffer to Cloudinary
      }

      // Create and save the post in MongoDB
      const blog = await Post.create(req.body);
      return res.status(201).json({ message: "Post created successfully", blog });

    } catch (error:any) {
      throw new ErrorResponse(error.message, 500);
    }
  });
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