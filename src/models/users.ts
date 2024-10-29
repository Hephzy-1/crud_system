import mongoose, { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  role?: string;
  password: string;
  salt?: string;
  sessionToken?: string;
  _id: string;
  post: Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  password: { type: String, required: true, select: false },
  salt: { type: String, select: false },
  sessionToken: { type: String, select: false },
  post: [
    { type: Types.ObjectId, ref: 'post' }
  ]
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
