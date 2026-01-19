import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;
const SESSION_EXPIRY_HOURS = parseInt(process.env.SESSION_EXPIRY_HOURS) || 24;

// Register new user
export const register = async (req, res) => {
  const { username, email, password, fullName } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  try {
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Insert new user
    const result = await query(
      `INSERT INTO users (username, email, password_hash, full_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, username, email, full_name, role, created_at`,
      [username, email, passwordHash, fullName || null, 'user']
    );

    const user = result.rows[0];

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login user
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Find user
    const result = await query(
      'SELECT * FROM users WHERE username = $1 AND is_active = true',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const sessionToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);

    await query(
      `INSERT INTO sessions (user_id, session_token, expires_at, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        sessionToken,
        expiresAt,
        req.ip,
        req.get('user-agent') || null,
      ]
    );

    // Update last login
    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    // Log activity
    await query(
      'INSERT INTO activity_log (user_id, action, ip_address) VALUES ($1, $2, $3)',
      [user.id, 'LOGIN', req.ip]
    );

    res.json({
      message: 'Login successful',
      sessionToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout user
export const logout = async (req, res) => {
  const { sessionToken } = req.body;

  if (!sessionToken) {
    return res.status(400).json({ error: 'Session token is required' });
  }

  try {
    // Delete session
    const result = await query('DELETE FROM sessions WHERE session_token = $1 RETURNING user_id', [
      sessionToken,
    ]);

    if (result.rows.length > 0) {
      // Log activity
      await query(
        'INSERT INTO activity_log (user_id, action, ip_address) VALUES ($1, $2, $3)',
        [result.rows[0].user_id, 'LOGOUT', req.ip]
      );
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};

// Verify session (middleware)
export const verifySession = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No session token provided' });
  }

  const sessionToken = authHeader.substring(7);

  try {
    const result = await query(
      `SELECT u.id, u.username, u.email, u.full_name, u.role 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.session_token = $1 AND s.expires_at > CURRENT_TIMESTAMP AND u.is_active = true`,
      [sessionToken]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if user is admin (middleware)
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
// Update user profile
export const updateProfile = async (req, res) => {
  const { username, password } = req.body;
  const userId = req.user.id;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Check if new username is taken by another user
    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1 AND id != $2',
      [username, userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    let queryText;
    let queryParams;

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }
      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      queryText = 'UPDATE users SET username = $1, password_hash = $2 WHERE id = $3 RETURNING id, username, email, full_name, role';
      queryParams = [username, passwordHash, userId];
    } else {
      queryText = 'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email, full_name, role';
      queryParams = [username, userId];
    }

    const result = await query(queryText, queryParams);
    const user = result.rows[0];

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
