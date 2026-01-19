# Library Management System - Backend

Backend API for the Library Management System built with Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your settings:

```bash
copy .env.example .env
```

Edit `.env` and update the following:

- `DB_PASSWORD`: Your PostgreSQL password
- `SESSION_SECRET`: A random secret key for sessions
- Other settings as needed

### 3. Initialize Database

Make sure PostgreSQL is running, then run:

```bash
npm run init-db
```

This will:

- Create the `library_db` database
- Run all schema migrations
- Create a default admin user (username: `admin`, password: `admin123`)

⚠️ **IMPORTANT**: Change the default admin password after first login!

### 4. Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (requires auth)

### Books

All book endpoints require authentication (Bearer token in Authorization header)

- `GET /api/books` - Get all books (supports search, pagination)
- `GET /api/books/:id` - Get single book with files
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book (soft delete)

### Files

All file endpoints require authentication

- `GET /api/files/book/:bookId` - Get all files for a book
- `GET /api/files/:id/download` - Download file
- `POST /api/files/book/:bookId/upload` - Upload file (multipart/form-data)
- `DELETE /api/files/:id` - Delete file (soft delete)

## Project Structure

```
backend/
├── config/
│   └── database.js       # Database connection configuration
├── controllers/
│   ├── authController.js # Authentication logic
│   ├── booksController.js # Books CRUD operations
│   └── filesController.js # File upload/download logic
├── routes/
│   ├── auth.js           # Auth routes
│   ├── books.js          # Books routes
│   └── files.js          # Files routes
├── scripts/
│   └── initDatabase.js   # Database initialization script
├── uploads/              # File upload directory
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── server.js             # Main server file
```

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Rate limiting
- CORS protection
- Helmet security headers
- SQL injection protection (parameterized queries)
- File upload size limits

## Default Admin Credentials

**Username**: `admin`  
**Password**: `admin123`

⚠️ **Change this immediately in production!**

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### Port Already in Use

- Change `PORT` in `.env` file
- Or kill the process using port 3001

### File Upload Issues

- Check `uploads/` directory exists and is writable
- Verify `MAX_FILE_SIZE_MB` setting in `.env`

## Development

To add new features:

1. Create controller in `controllers/`
2. Create routes in `routes/`
3. Mount routes in `server.js`
4. Update this README

## License

ISC
