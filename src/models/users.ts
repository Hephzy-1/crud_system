import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  username: string,
  email: string,
  role: string,
  authentication: {
    password: string,
    salt?: string,
    sessionToken?: string
  },
  _id: string
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false},
    sessionToken: { type: String, select: false }
  }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;