import express from 'express';
import passport from '../config/passport.js';
import Session from '../models/Session.js';
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

// OAuth callback handler
const handleOAuthCallback = async (req, res) => {
  try {
    // Create session
    const session = await Session.createSession(
      req.user._id,
      req.ip,
      req.get('user-agent')
    );

    // Redirect to frontend with session token
    const userData = {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role,
      avatarUrl: req.user.avatarUrl
    };

    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${session.sessionToken}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
  }
};

// OAuth routes - Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  handleOAuthCallback
);

// OAuth routes - GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  handleOAuthCallback
);

// OAuth routes - Microsoft
router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));
router.get('/microsoft/callback',
  passport.authenticate('microsoft', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  handleOAuthCallback
);

export default router;
