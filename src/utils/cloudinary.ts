import { v2 as cloudinary } from 'cloudinary';
import { ErrorResponse } from './errorResponse';
import sharp from 'sharp';


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
    
export interface CustomFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  size: number;
  buffer: Buffer;
  mimetype: string;
}

export function validateImage(file: Express.Multer.File): boolean {
  const imagesAllowed = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

  return imagesAllowed.includes(file.mimetype);
}

export default cloudinary;