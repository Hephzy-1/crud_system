import crypto from 'crypto';
import dotenv from 'dotenv';
import { ErrorResponse } from '../utils/errorResponse';
dotenv.config()

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new ErrorResponse("Secret key is required", 500)
}

export const random = () => crypto.randomBytes(128).toString('base64');

export const authentication = (salt: string, password: string) => {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex')
};
