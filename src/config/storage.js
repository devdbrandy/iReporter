import multer from 'multer';
import { getFileExtension } from '../utils';

export const storageConfig = {
  destination: 'uploads',
  filename: (req, { fieldname, originalname }, cb) => {
    const ext = getFileExtension(originalname);
    cb(null, `${fieldname}-${Date.now()}.${ext}`);
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    return cb(null, true);
  },
};

export const upload = multer({ storage: multer.diskStorage(storageConfig) });
