import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setSessionToken } = useAuth() as any;

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      navigate(`/login?error=${error}`);
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store in localStorage
        localStorage.setItem('sessionToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update context (if setUser/setSessionToken methods exist)
        if (typeof setUser === 'function') setUser(user);
        if (typeof setSessionToken === 'function') setSessionToken(token);
        
        // Redirect to library
        navigate('/library');
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login?error=invalid_callback');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-slate-300">Completing login...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
