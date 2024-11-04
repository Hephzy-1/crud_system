import { NextFunction, Request, Response } from 'express';
import { Post } from '../usecases/posts';
import { User } from '../usecases/user';
import asyncHandler from '../middlewares/async';
import { IPost } from '../models/posts';
import { ErrorResponse } from '../utils/errorResponse';
import { makePost, userPost, updatePost } from '../validators/post';
import upload from '../utils/multer';
import cloudinary from '../utils/cloudinary';

const uploadCoverImage = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(new ErrorResponse('Image upload failed', 500));
        } else {
          resolve(result?.secure_url || '');
        }
      }
    );
    uploadStream.end(file.buffer);
  });
};

export const createPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Validate and process the post input data
  const { error, value } = makePost.validate(req.body);

  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  req.body.userId = req.user?._id;

  if (!req.body.userId) {
    throw new ErrorResponse('User ID is required', 400);
  }
 
  // Check if user exists
  const user = await User.userById(req.body.userId);
  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  // try {
  //   // Upload image to Cloudinary and attach URL to the coverImage field
  //   if (req.file) {
  //     const uploadResult = cloudinary.uploader.upload_stream(
  //       { resource_type: 'image' },
  //       (cloudErr, result) => {
  //         if (cloudErr) throw new ErrorResponse('Image upload failed', 500);
  //         console.log({ result });
  //         req.body.coverImage = result?.secure_url; // Set Cloudinary URL as coverImage
  //       }
  //     );
  //     console.log(req.file.buffer);
  //     uploadResult.end(req.file.buffer); // Pass file buffer to Cloudinary
  //   } else {
  //     return next(new ErrorResponse('Image is required', 400));
  //   }
  // } catch (error: any) {
  //   throw new ErrorResponse(error.message, 500);
  // }

  if (req.file) {
    req.body.coverImage = await uploadCoverImage(req.file);
  }


  // Create and save the post in MongoDB
  const blog = await Post.create(req.body);
  return res.status(201).json({ message: 'Post created successfully', blog });
});

export const getPostsByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { error, value } = userPost.validate(req.params);

      if (error) {
        throw new ErrorResponse('User ID is required', 400);
      }

      const { id } = value;

      const post = await Post.postByUserId(id);
      if (!post) {
        throw new ErrorResponse('Post not found', 404);
      }
      res.status(200).json({ post });
    } catch (error: any) {
      throw new ErrorResponse(error.message, 500);
    }
  }
);

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const post = await Post.getPosts();

    return res.status(200).json({ message: 'Here is all the posts:', post });
  } catch (error: any) {
    throw new ErrorResponse(error.message, 500);
  }
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = updatePost.validate(req.body);

    if (error) {
      throw new ErrorResponse('post update is required', 400);
    }

    const { update } = value;

    const pushUpdate = await Post.update(id, update);

    return res
      .status(200)
      .json({ message: 'Post has been updated', post: pushUpdate });
  } catch (error: any) {
    throw new ErrorResponse(error.message, 500);
  }
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Post.delete(id);

    return res
      .status(200)
      .json({ message: 'Successfully deleted post', success: deleted });
  } catch (error: any) {
    throw new ErrorResponse(error.message, 500);
  }
});
