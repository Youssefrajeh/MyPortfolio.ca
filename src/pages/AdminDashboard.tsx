import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.PROD 
  ? 'https://myportfolio-light-main.onrender.com/api'
  : 'http://localhost:3001/api';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  isbn: string;
  publisher: string;
  publication_year: number;
  cover_image_url: string;
}

const AdminDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [uploading, setUploading] = useState(false);

  const { user, updateUser } = useAuth();

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    password: '',
    confirmPassword: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    publisher: '',
    publicationYear: '',
    coverImageUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setUploading(true);
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, {
        username: profileData.username,
        password: profileData.password || undefined // Only send if set
      });

      updateUser(response.data.user);
      alert('Profile updated successfully');
      setShowProfileSettings(false);
      setProfileData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error updating profile');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const bookData = {
        title: formData.title,
        author: formData.author || null,
        description: formData.description || null,
        isbn: formData.isbn || null,
        publisher: formData.publisher || null,
        publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null,
        coverImageUrl: formData.coverImageUrl || null,
      };

      let bookId;
      if (editingBook) {
        await axios.put(`${API_URL}/books/${editingBook.id}`, bookData);
        bookId = editingBook.id;
      } else {
        const response = await axios.post(`${API_URL}/books`, bookData);
        bookId = response.data.book.id;
      }

      // Handle file upload if a file is selected
      if (selectedFile && bookId) {
        const fileFormData = new FormData();
        fileFormData.append('file', selectedFile);
        
        try {
          await axios.post(`${API_URL}/files/book/${bookId}/upload`, fileFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          alert('Book saved, but file upload failed. Please try adding the file again.');
        }
      }

      await fetchBooks();
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error saving book');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await axios.delete(`${API_URL}/books/${id}`);
      await fetchBooks();
    } catch (error) {
      alert('Error deleting book');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author || '',
      description: book.description || '',
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      publicationYear: book.publication_year?.toString() || '',
      coverImageUrl: book.cover_image_url || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      isbn: '',
      publisher: '',
      publicationYear: '',
      coverImageUrl: '',
    });
    setSelectedFile(null);
    setEditingBook(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              ⚙️ Admin Dashboard
            </h1>
            <p className="text-slate-400">Manage your library collection</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/library"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all"
            >
              ← Back to Library
            </Link>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-lg shadow-primary/50 transition-all"
            >
              {showForm ? 'Cancel' : '+ Add Book'}
            </button>
            <button
              onClick={() => {
                setShowProfileSettings(!showProfileSettings);
                setShowForm(false);
                setProfileData({
                  username: user?.username || '',
                  password: '',
                  confirmPassword: ''
                });
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all"
            >
              {showProfileSettings ? 'Close Settings' : 'Profile Settings'}
            </button>
          </div>
        </div>

        {/* Profile Settings Form */}
        {showProfileSettings && (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              Update Profile
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  minLength={8}
                  value={profileData.password}
                  onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  minLength={8}
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-lg shadow-primary/50 transition-all disabled:opacity-50"
                >
                  {uploading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileSettings(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Publisher
                </label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Publication Year
                </label>
                <input
                  type="number"
                  value={formData.publicationYear}
                  onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Book File (PDF, DOC/DOCX, Image)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                  {selectedFile && (
                     <p className="mt-2 text-sm text-green-400">
                      Selected: {selectedFile.name}
                     </p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-lg shadow-primary/50 transition-all disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : editingBook ? 'Update Book' : 'Add Book'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-lg">No books in the library yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all"
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ISBN</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Year</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{book.title}</td>
                    <td className="px-6 py-4 text-slate-400">{book.author || '-'}</td>
                    <td className="px-6 py-4 text-slate-400">{book.isbn || '-'}</td>
                    <td className="px-6 py-4 text-slate-400">{book.publication_year || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(book)}
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-md text-sm mr-2 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md text-sm transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
