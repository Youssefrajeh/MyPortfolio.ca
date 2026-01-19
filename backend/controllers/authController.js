import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Session from '../models/Session.js';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

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
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create new user
    const user = await User.create({
      username,
      email,
      passwordHash,
      fullName: fullName || null,
      role: 'user'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    console.error('Stack:', error.stack);
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
    // Find user (username or email)
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      isActive: true
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const session = await Session.createSession(
      user._id,
      req.ip,
      req.get('user-agent') || null
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: 'Login successful',
      sessionToken: session.sessionToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
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
    await Session.deleteOne({ sessionToken });
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
    const user = await Session.validateSession(sessionToken);

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
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
    const existingUser = await User.findOne({
      username,
      _id: { $ne: userId }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const updateData = { username };

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }
      updateData.passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: 'username email fullName role' }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
