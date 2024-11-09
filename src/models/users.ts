import mongoose, { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  role?: string;
  password?: string;
  salt?: number;
  sessionToken?: string;
  _id: string;
  googleId?: string;
  post: Types.ObjectId[];
  isModified: (field: string) => boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  password: { type: String },
  googleId: { type: String },
  salt: { type: Number, default: 10 },
  sessionToken: { type: String },
  post: [
    { type: Types.ObjectId, ref: 'post' }
  ]
},
  {
  toJSON: {
      transform: function (doc, ret) { 
          delete ret.password;
          delete ret.__v;
          delete ret.createdAt;
          delete ret.updatedAt;
      }
  },
  timestamps: true,
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
