import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

const API_URL = import.meta.env.PROD 
  ? 'https://myportfolio-light-main.onrender.com/api'
  : 'http://localhost:3001/api';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_image_url: string;
  file_count: number;
  created_at: string;
}

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user, loading: authLoading } = useAuth();
  
  if (authLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-slate-900">
         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
       </div>
     );
  }

  if (!user) {
    return <Login />;
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/books`);
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            📚 Digital Library
          </h1>
          <p className="text-slate-400 text-lg">
            Your personal collection of books and resources
          </p>
        </div>

        {/* Search and Admin Link */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-lg shadow-primary/50 transition-all duration-300 text-center"
            >
              ⚙️ Admin Dashboard
            </Link>
          )}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              {search ? 'No books found matching your search.' : 'No books in the library yet.'}
            </p>
            {user?.role === 'admin' && !search && (
              <Link
                to="/admin"
                className="inline-block mt-4 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all"
              >
                Add Your First Book
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-slate-800/50 backdrop-blur-lg rounded-xl overflow-hidden border border-slate-700/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 transform hover:scale-105"
              >
                {/* Book Cover */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  {book.cover_image_url ? (
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">📖</span>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="text-sm text-slate-400 mb-2">{book.author}</p>
                  )}
                  {book.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                      {book.description}
                    </p>
                  )}
                  
                  {/* File Count Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {book.file_count} file{book.file_count !== 1 ? 's' : ''}
                    </span>
                    <button className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary text-sm rounded-md transition-all">
                      View Files
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
