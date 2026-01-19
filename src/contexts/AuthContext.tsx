import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.PROD 
  ? 'https://myportfolio-light-main.onrender.com/api'
  : 'http://localhost:3001/api';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setSessionToken(token);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      const { sessionToken: token, user: userData } = response.data;
      
      setSessionToken(token);
      setUser(userData);
      
      localStorage.setItem('sessionToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string, fullName?: string) => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        fullName,
      });

      // Auto-login after registration
      await login(username, password);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      if (sessionToken) {
        await axios.post(`${API_URL}/auth/logout`, { sessionToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setSessionToken(null);
      setUser(null);
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, sessionToken, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Axios interceptor to add auth token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('sessionToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
