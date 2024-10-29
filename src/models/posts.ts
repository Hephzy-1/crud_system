import { Document, Schema, Model, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  post: string;
  userId: Tpes.ObjectId;
}

const postModel = Schema<IPost>({
  title: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  userId: { type: Types.ObjectId, required: true, ref: 'user'}
});

const Post = model<IPost>('Post', postModel);

export default Post;