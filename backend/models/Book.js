import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  author: {
    type: String,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    trim: true
  },
  isbn: {
    type: String,
    trim: true,
    maxlength: 20
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: 255
  },
  publicationYear: {
    type: Number
  },
  coverImageUrl: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ createdBy: 1 });
bookSchema.index({ isDeleted: 1 });

const Book = mongoose.model('Book', bookSchema);

export default Book;
