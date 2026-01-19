import { query } from '../config/database.js';

// Get all books
export const getAllBooks = async (req, res) => {
  const { search, author, category, limit = 50, offset = 0 } = req.query;

  try {
    let queryText = `
      SELECT b.*, 
             COUNT(DISTINCT f.id) as file_count,
             COALESCE(SUM(f.file_size), 0) as total_file_size,
             u.username as created_by_username
      FROM books b
      LEFT JOIN files f ON b.id = f.book_id AND f.is_deleted = false
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.is_deleted = false
    `;

    const params = [];
    let paramIndex = 1;

    // Add search filter
    if (search) {
      queryText += ` AND (b.title ILIKE $${paramIndex} OR b.author ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add author filter
    if (author) {
      queryText += ` AND b.author ILIKE $${paramIndex}`;
      params.push(`%${author}%`);
      paramIndex++;
    }

    queryText += ` GROUP BY b.id, u.username ORDER BY b.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM books WHERE is_deleted = false',
      []
    );

    res.json({
      books: result.rows,
      total: parseInt(countResult.rows[0].count),
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
    const result = await query(
      `SELECT b.*, 
              u.username as created_by_username,
              json_agg(
                json_build_object(
                  'id', f.id,
                  'filename', f.filename,
                  'originalFilename', f.original_filename,
                  'fileSize', f.file_size,
                  'mimeType', f.mime_type,
                  'fileType', f.file_type,
                  'uploadedAt', f.uploaded_at,
                  'downloadCount', f.download_count
                )
              ) FILTER (WHERE f.id IS NOT NULL) as files
       FROM books b
       LEFT JOIN files f ON b.id = f.book_id AND f.is_deleted = false
       LEFT JOIN users u ON b.created_by = u.id
       WHERE b.id = $1 AND b.is_deleted = false
       GROUP BY b.id, u.username`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ book: result.rows[0] });
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
    const result = await query(
      `INSERT INTO books (title, author, description, isbn, publisher, publication_year, cover_image_url, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        title,
        author || null,
        description || null,
        isbn || null,
        publisher || null,
        publicationYear || null,
        coverImageUrl || null,
        req.user.id,
      ]
    );

    // Log activity
    await query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'CREATE', 'BOOK', result.rows[0].id]
    );

    res.status(201).json({ book: result.rows[0] });
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
    const result = await query(
      `UPDATE books 
       SET title = COALESCE($1, title),
           author = COALESCE($2, author),
           description = COALESCE($3, description),
           isbn = COALESCE($4, isbn),
           publisher = COALESCE($5, publisher),
           publication_year = COALESCE($6, publication_year),
           cover_image_url = COALESCE($7, cover_image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 AND is_deleted = false
       RETURNING *`,
      [title, author, description, isbn, publisher, publicationYear, coverImageUrl, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Log activity
    await query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'UPDATE', 'BOOK', id]
    );

    res.json({ book: result.rows[0] });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete book (soft delete)
export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      'UPDATE books SET is_deleted = true WHERE id = $1 AND is_deleted = false RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Also soft delete associated files
    await query('UPDATE files SET is_deleted = true WHERE book_id = $1', [id]);

    // Log activity
    await query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'DELETE', 'BOOK', id]
    );

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
