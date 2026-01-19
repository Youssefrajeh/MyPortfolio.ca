import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { query } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

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
          // Check if user exists with this OAuth ID
          let result = await query(
            'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
            ['google', profile.id]
          );

          let user;
          if (result.rows.length > 0) {
            // User exists, update their info
            user = result.rows[0];
            await query(
              'UPDATE users SET avatar_url = $1, last_login = CURRENT_TIMESTAMP WHERE id = $2',
              [profile.photos?.[0]?.value, user.id]
            );
          } else {
            // Create new user
            const email = profile.emails?.[0]?.value;
            const username = email?.split('@')[0] || `google_${profile.id}`;
            
            result = await query(
              `INSERT INTO users (username, email, oauth_provider, oauth_id, full_name, avatar_url, role) 
               VALUES ($1, $2, $3, $4, $5, $6, $7) 
               RETURNING *`,
              [
                username,
                email,
                'google',
                profile.id,
                profile.displayName,
                profile.photos?.[0]?.value,
                'user',
              ]
            );
            user = result.rows[0];
          }

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
          // Check if user exists with this OAuth ID
          let result = await query(
            'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
            ['github', profile.id]
          );

          let user;
          if (result.rows.length > 0) {
            // User exists, update their info
            user = result.rows[0];
            await query(
              'UPDATE users SET avatar_url = $1, last_login = CURRENT_TIMESTAMP WHERE id = $2',
              [profile.photos?.[0]?.value, user.id]
            );
          } else {
            // Create new user
            const email = profile.emails?.[0]?.value;
            const username = profile.username || `github_${profile.id}`;
            
            result = await query(
              `INSERT INTO users (username, email, oauth_provider, oauth_id, full_name, avatar_url, role) 
               VALUES ($1, $2, $3, $4, $5, $6, $7) 
               RETURNING *`,
              [
                username,
                email,
                'github',
                profile.id,
                profile.displayName || profile.username,
                profile.photos?.[0]?.value,
                'user',
              ]
            );
            user = result.rows[0];
          }

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
          // Check if user exists with this OAuth ID
          let result = await query(
            'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
            ['microsoft', profile.id]
          );

          let user;
          if (result.rows.length > 0) {
            // User exists, update their info
            user = result.rows[0];
            await query(
              'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
              [user.id]
            );
          } else {
            // Create new user
            const email = profile.emails?.[0]?.value;
            const username = email?.split('@')[0] || `microsoft_${profile.id}`;
            
            result = await query(
              `INSERT INTO users (username, email, oauth_provider, oauth_id, full_name, role) 
               VALUES ($1, $2, $3, $4, $5, $6) 
               RETURNING *`,
              [
                username,
                email,
                'microsoft',
                profile.id,
                profile.displayName,
                'user',
              ]
            );
            user = result.rows[0];
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

export default passport;
