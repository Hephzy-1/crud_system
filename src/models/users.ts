// models/users.ts
import mongoose, { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  role: 'user' | 'admin';  // Make role type more specific
  password?: string;
  salt?: number;
  sessionToken?: string;
  _id: string;
  googleId?: string;
  posts: Types.ObjectId[];  // Renamed to plural for clarity
  isModified: (field: string) => boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  password: { type: String, select: false },  // Hide password by default
  googleId: { type: String },
  salt: { type: Number, default: 10, select: false },  // Hide salt by default
  sessionToken: { type: String },
  posts: [{ type: Types.ObjectId, ref: 'Post' }]  // Capitalized model name
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.salt;
      delete ret.__v;
      return ret;
    }
  },
  timestamps: true,
});

// Add index for email lookups
userSchema.index({ email: 1 });

const User = mongoose.model<IUser>('User', userSchema);
export default User;
