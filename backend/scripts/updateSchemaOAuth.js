import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function updateSchema() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'library_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Add OAuth columns
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50),
      ADD COLUMN IF NOT EXISTS oauth_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS avatar_url TEXT
    `);
    console.log('✅ Added OAuth columns');

    // Make email and password optional for OAuth users
    await client.query(`
      ALTER TABLE users 
      ALTER COLUMN email DROP NOT NULL,
      ALTER COLUMN password_hash DROP NOT NULL
    `);
    console.log('✅ Made email and password optional');

    // Create index for OAuth lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_id)
    `);
    console.log('✅ Created OAuth index');

    await client.end();
    console.log('\n✅ Database schema updated for OAuth!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateSchema();
