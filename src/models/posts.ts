import { Document, Schema, model, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  coverImage: string;
  post: string;
  userId: Types.ObjectId;
}

const postModel = new Schema<IPost>({
  title: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'user'}
});

const Post = model<IPost>('Post', postModel);

export default Post;