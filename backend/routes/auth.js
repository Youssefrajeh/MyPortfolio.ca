import express from 'express';
import passport from '../config/passport.js';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import {
  register,
  login,
  logout,
  getCurrentUser,
  verifySession,
  updateProfile,
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', verifySession, getCurrentUser);
router.put('/profile', verifySession, updateProfile);

// OAuth routes - Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  async (req, res) => {
    try {
      // Create session token
      const sessionToken = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await query(
        'INSERT INTO sessions (user_id, session_token, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
        [req.user.id, sessionToken, expiresAt, req.ip, req.get('user-agent')]
      );

      // Redirect to frontend with session token
      res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${sessionToken}&user=${encodeURIComponent(JSON.stringify({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.full_name,
        role: req.user.role,
        avatarUrl: req.user.avatar_url
      }))}`);  
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
    }
  }
);

// OAuth routes - GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  async (req, res) => {
    try {
      const sessionToken = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await query(
        'INSERT INTO sessions (user_id, session_token, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
        [req.user.id, sessionToken, expiresAt, req.ip, req.get('user-agent')]
      );

      res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${sessionToken}&user=${encodeURIComponent(JSON.stringify({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.full_name,
        role: req.user.role,
        avatarUrl: req.user.avatar_url
      }))}`);  
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
    }
  }
);

// OAuth routes - Microsoft
router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));
router.get('/microsoft/callback',
  passport.authenticate('microsoft', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  async (req, res) => {
    try {
      const sessionToken = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await query(
        'INSERT INTO sessions (user_id, session_token, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
        [req.user.id, sessionToken, expiresAt, req.ip, req.get('user-agent')]
      );

      res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${sessionToken}&user=${encodeURIComponent(JSON.stringify({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.full_name,
        role: req.user.role,
        avatarUrl: req.user.avatar_url
      }))}`);  
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
    }
  }
);

export default router;
