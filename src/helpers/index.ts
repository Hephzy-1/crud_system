import crypto from 'crypto';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { ErrorResponse } from '../utils/errorResponse';
dotenv.config()

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new ErrorResponse("Secret key is required", 500)
}

export const authentication = (salt: number, password: string) => {
  const hash = crypto.createHmac('sha256', [salt, password].join('/'));
  hash.update(SECRET);
  return hash.digest('hex');
};

export const hashPassword = async(password: string) => {
  return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, userPassword: string) => {
  return await bcrypt.compare(password, userPassword)
};