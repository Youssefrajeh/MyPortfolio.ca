import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Helper function to find or create OAuth user
const findOrCreateOAuthUser = async (provider, profile) => {
  // Check if user exists with this OAuth ID
  let user = await User.findOne({
    oauthProvider: provider,
    oauthId: profile.id
  });

  if (user) {
    // User exists, update their info
    user.lastLogin = new Date();
    if (profile.photos?.[0]?.value) {
      user.avatarUrl = profile.photos[0].value;
    }
    await user.save();
  } else {
    // Check if user exists with same email
    const email = profile.emails?.[0]?.value;
    if (email) {
      user = await User.findOne({ email });
      if (user) {
        // Link OAuth to existing account
        user.oauthProvider = provider;
        user.oauthId = profile.id;
        user.lastLogin = new Date();
        if (profile.photos?.[0]?.value) {
          user.avatarUrl = profile.photos[0].value;
        }
        await user.save();
        return user;
      }
    }

    // Create new user
    const username = profile.username || email?.split('@')[0] || `${provider}_${profile.id}`;
    
    user = await User.create({
      username,
      email,
      oauthProvider: provider,
      oauthId: profile.id,
      fullName: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value,
      role: 'user',
      lastLogin: new Date()
    });
  }

  return user;
};

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser('google', profile);
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/api/auth/github/callback',
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser('github', profile);
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// Microsoft OAuth Strategy
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:3001/api/auth/microsoft/callback',
        scope: ['user.read'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser('microsoft', profile);
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

export default passport;
