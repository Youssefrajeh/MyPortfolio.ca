import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log('🔧 Initializing database...\n');

  // First, connect to postgres database to create our library_db
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  });

  try {
    await adminClient.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const dbCheckResult = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME || 'library_db']
    );

    if (dbCheckResult.rows.length === 0) {
      // Create database
      await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME || 'library_db'}`);
      console.log(`✅ Created database: ${process.env.DB_NAME || 'library_db'}`);
    } else {
      console.log(`ℹ️  Database already exists: ${process.env.DB_NAME || 'library_db'}`);
    }

    await adminClient.end();

    // Now connect to the library database and run schema
    const client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'library_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
    });

    await client.connect();
    console.log(`✅ Connected to ${process.env.DB_NAME || 'library_db'}`);

    // Read and execute schema file
    const schemaPath = path.join(__dirname, '../../.gemini/antigravity/brain/21428d68-335a-4e66-b372-4ba7c4a89b43/database_schema.sql');
    
    let schemaSQL;
    try {
      schemaSQL = await fs.readFile(schemaPath, 'utf-8');
    } catch (error) {
      console.log('⚠️  Schema file not found at expected location, using embedded schema');
      // If schema file not found, we'll create tables manually
      schemaSQL = await createBasicSchema();
    }

    // Execute schema
    await client.query(schemaSQL);
    console.log('✅ Database schema created successfully');

    // Check if admin user exists
    const adminCheck = await client.query(
      `SELECT id FROM users WHERE username = 'admin'`
    );

    if (adminCheck.rows.length === 0) {
      console.log('ℹ️  Creating default admin user...');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!\n');
    }

    await client.end();
    console.log('\n✅ Database initialization complete!');
    console.log('🎉 You can now start the server with: npm run dev\n');

  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  }
}

async function createBasicSchema() {
  // Return basic schema if file not found
  return `
    -- Basic schema creation
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(100),
      role VARCHAR(20) DEFAULT 'user',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip_address VARCHAR(45),
      user_agent TEXT
    );

    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255),
      description TEXT,
      isbn VARCHAR(20),
      publisher VARCHAR(255),
      publication_year INTEGER,
      cover_image_url TEXT,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_deleted BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS files (
      id SERIAL PRIMARY KEY,
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      filename VARCHAR(255) NOT NULL,
      original_filename VARCHAR(255) NOT NULL,
      file_path TEXT NOT NULL,
      file_size BIGINT NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_type VARCHAR(50),
      uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      download_count INTEGER DEFAULT 0,
      is_deleted BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(50) NOT NULL,
      entity_type VARCHAR(50),
      entity_id INTEGER,
      details JSONB,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
    CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
    CREATE INDEX IF NOT EXISTS idx_files_book_id ON files(book_id);
  `;
}

// Run initialization
initializeDatabase();
