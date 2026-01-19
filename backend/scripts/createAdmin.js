import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function createAdminUser() {
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

    // Check if admin user exists
    const checkResult = await client.query(
      'SELECT id FROM users WHERE username = $1',
      ['admin']
    );

    if (checkResult.rows.length > 0) {
      console.log('ℹ️  Admin user already exists, updating password...');
      
      // Hash the password
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      // Update admin user
      await client.query(
        'UPDATE users SET password_hash = $1 WHERE username = $2',
        [passwordHash, 'admin']
      );
      
      console.log('✅ Admin password updated successfully');
    } else {
      console.log('Creating new admin user...');
      
      // Hash the password
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      // Create admin user
      await client.query(
        `INSERT INTO users (username, email, password_hash, full_name, role) 
         VALUES ($1, $2, $3, $4, $5)`,
        ['admin', 'admin@library.com', passwordHash, 'Administrator', 'admin']
      );
      
      console.log('✅ Admin user created successfully');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!\n');

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
