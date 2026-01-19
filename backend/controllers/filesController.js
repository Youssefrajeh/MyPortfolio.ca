import path from 'path';
import fs from 'fs/promises';
import File from '../models/File.js';
import Book from '../models/Book.js';

// Get file
export const getFile = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await File.findOne({ _id: id, isDeleted: false });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Increment download count
    file.downloadCount += 1;
    await file.save();

    // Send file
    res.download(file.filePath, file.originalFilename);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Upload file
export const uploadFile = async (req, res) => {
  const { bookId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Verify book exists
    const book = await Book.findOne({ _id: bookId, isDeleted: false });

    if (!book) {
      // Delete uploaded file
      await fs.unlink(req.file.path);
      return res.status(404).json({ error: 'Book not found' });
    }

    // Determine file type from MIME type
    let fileType = 'other';
    if (req.file.mimetype === 'application/pdf') fileType = 'pdf';
    else if (req.file.mimetype === 'application/epub+zip') fileType = 'epub';
    else if (req.file.mimetype === 'application/x-mobipocket-ebook') fileType = 'mobi';

    // Create file record
    const file = await File.create({
      bookId,
      filename: req.file.filename,
      originalFilename: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fileType,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      file: {
        id: file._id,
        filename: file.filename,
        originalFilename: file.originalFilename,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        fileType: file.fileType,
        uploadedAt: file.uploadedAt
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    // Try to delete uploaded file on error
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error('Error deleting file after upload failure:', unlinkError);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await File.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get files for a book
export const getBookFiles = async (req, res) => {
  const { bookId } = req.params;

  try {
    const files = await File.find({ bookId, isDeleted: false })
      .populate('uploadedBy', 'username')
      .sort({ uploadedAt: -1 })
      .lean();

    res.json({
      files: files.map(f => ({
        id: f._id,
        filename: f.filename,
        originalFilename: f.originalFilename,
        fileSize: f.fileSize,
        mimeType: f.mimeType,
        fileType: f.fileType,
        uploadedAt: f.uploadedAt,
        downloadCount: f.downloadCount,
        uploaded_by_username: f.uploadedBy?.username
      }))
    });
  } catch (error) {
    console.error('Get book files error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
