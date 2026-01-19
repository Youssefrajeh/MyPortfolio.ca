import Book from '../models/Book.js';
import File from '../models/File.js';
import User from '../models/User.js';

// Get all books
export const getAllBooks = async (req, res) => {
  const { search, author, limit = 50, offset = 0 } = req.query;

  try {
    // Build query
    const query = { isDeleted: false };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Add author filter
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    // Get books with file count
    const books = await Book.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .lean();

    // Get file counts for each book
    const booksWithFiles = await Promise.all(
      books.map(async (book) => {
        const fileStats = await File.aggregate([
          { $match: { bookId: book._id, isDeleted: false } },
          { $group: { _id: null, count: { $sum: 1 }, totalSize: { $sum: '$fileSize' } } }
        ]);

        return {
          ...book,
          id: book._id,
          file_count: fileStats[0]?.count || 0,
          total_file_size: fileStats[0]?.totalSize || 0,
          created_by_username: book.createdBy?.username
        };
      })
    );

    // Get total count
    const total = await Book.countDocuments({ isDeleted: false });

    res.json({
      books: booksWithFiles,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single book
export const getBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findOne({ _id: id, isDeleted: false })
      .populate('createdBy', 'username')
      .lean();

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Get files
    const files = await File.find({ bookId: id, isDeleted: false })
      .select('filename originalFilename fileSize mimeType fileType uploadedAt downloadCount')
      .lean();

    res.json({
      book: {
        ...book,
        id: book._id,
        created_by_username: book.createdBy?.username,
        files: files.map(f => ({
          id: f._id,
          filename: f.filename,
          originalFilename: f.originalFilename,
          fileSize: f.fileSize,
          mimeType: f.mimeType,
          fileType: f.fileType,
          uploadedAt: f.uploadedAt,
          downloadCount: f.downloadCount
        }))
      }
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create book
export const createBook = async (req, res) => {
  const { title, author, description, isbn, publisher, publicationYear, coverImageUrl } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const book = await Book.create({
      title,
      author: author || null,
      description: description || null,
      isbn: isbn || null,
      publisher: publisher || null,
      publicationYear: publicationYear || null,
      coverImageUrl: coverImageUrl || null,
      createdBy: req.user.id,
    });

    res.status(201).json({
      book: {
        ...book.toObject(),
        id: book._id
      }
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update book
export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, description, isbn, publisher, publicationYear, coverImageUrl } = req.body;

  try {
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (description !== undefined) updateData.description = description;
    if (isbn !== undefined) updateData.isbn = isbn;
    if (publisher !== undefined) updateData.publisher = publisher;
    if (publicationYear !== undefined) updateData.publicationYear = publicationYear;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;

    const book = await Book.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateData,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      book: {
        ...book.toObject(),
        id: book._id
      }
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete book (soft delete)
export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Also soft delete associated files
    await File.updateMany({ bookId: id }, { isDeleted: true });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
