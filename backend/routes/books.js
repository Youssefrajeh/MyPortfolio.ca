import express from 'express';
import {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/booksController.js';
import { verifySession } from '../controllers/authController.js';

const router = express.Router();

// All routes require authentication
router.use(verifySession);

router.get('/', getAllBooks);
router.get('/:id', getBook);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
