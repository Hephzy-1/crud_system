import multer from 'multer';

const storage = multer.memoryStorage(); 

const upload = multer({
  storage,
  limits: { fileSize: 16 * 1024 * 1024 }, // Limit size to 16MB
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export default upload;
