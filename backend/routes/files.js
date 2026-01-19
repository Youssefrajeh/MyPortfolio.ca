import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getFile,
  uploadFile,
  deleteFile,
  getBookFiles,
} from '../controllers/filesController.js';
import { verifySession } from '../controllers/authController.js';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024, // Default 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types
    cb(null, true);
  },
});

// All routes require authentication
router.use(verifySession);

router.get('/book/:bookId', getBookFiles);
router.get('/:id/download', getFile);
router.post('/book/:bookId/upload', upload.single('file'), uploadFile);
router.delete('/:id', deleteFile);

export default router;
