import path from 'path';
import fs from 'fs/promises';
import { query } from '../config/database.js';

// Get file
export const getFile = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      'SELECT * FROM files WHERE id = $1 AND is_deleted = false',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = result.rows[0];

    // Increment download count
    await query('UPDATE files SET download_count = download_count + 1 WHERE id = $1', [id]);

    // Log activity
    await query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'DOWNLOAD', 'FILE', id]
    );

    // Send file
    res.download(file.file_path, file.original_filename);
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
    const bookResult = await query(
      'SELECT id FROM books WHERE id = $1 AND is_deleted = false',
      [bookId]
    );

    if (bookResult.rows.length === 0) {
      // Delete uploaded file
      await fs.unlink(req.file.path);
      return res.status(404).json({ error: 'Book not found' });
    }

    // Determine file type from MIME type
    let fileType = 'OTHER';
    if (req.file.mimetype.startsWith('image/')) fileType = 'IMAGE';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'VIDEO';
    else if (req.file.mimetype === 'application/pdf') fileType = 'PDF';
    else if (req.file.mimetype.includes('word')) fileType = 'WORD';
    else if (req.file.mimetype.includes('excel') || req.file.mimetype.includes('spreadsheet')) fileType = 'EXCEL';
    else if (req.file.mimetype.includes('powerpoint') || req.file.mimetype.includes('presentation')) fileType = 'POWERPOINT';
    else if (req.file.mimetype === 'text/plain') fileType = 'TEXT';
    else if (req.file.mimetype.includes('zip') || req.file.mimetype.includes('rar')) fileType = 'ARCHIVE';

    // Insert file record
    const result = await query(
      `INSERT INTO files (book_id, filename, original_filename, file_path, file_size, mime_type, file_type, uploaded_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        bookId,
        req.file.filename,
        req.file.originalname,
        req.file.path,
        req.file.size,
        req.file.mimetype,
        fileType,
        req.user.id,
      ]
    );

    // Log activity
    await query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'UPLOAD', 'FILE', result.rows[0].id, JSON.stringify({ bookId, filename: req.file.originalname })]
    );

    res.status(201).json({ file: result.rows[0] });
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
    const result = await query(
      'UPDATE files SET is_deleted = true WHERE id = $1 AND is_deleted = false RETURNING file_path',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Optionally delete physical file (commented out for safety - keeps file on disk)
    // try {
    //   await fs.unlink(result.rows[0].file_path);
    // } catch (unlinkError) {
    //   console.error('Error deleting physical file:', unlinkError);
    // }

    // Log activity
    await query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'DELETE', 'FILE', id]
    );

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
    const result = await query(
      `SELECT f.*, u.username as uploaded_by_username
       FROM files f
       LEFT JOIN users u ON f.uploaded_by = u.id
       WHERE f.book_id = $1 AND f.is_deleted = false
       ORDER BY f.uploaded_at DESC`,
      [bookId]
    );

    res.json({ files: result.rows });
  } catch (error) {
    console.error('Get book files error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
