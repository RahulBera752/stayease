import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attempt to restore session from httpOnly cookie on first load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        
        // 🔍 Handle both { user: {...} } and direct {...} responses
        const currentUser = data?.user || data;
        
        console.log('👤 [AuthContext] Logged in User:', currentUser);
        console.log('🏷️ [AuthContext] User Role:', currentUser?.role);

        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 🚪 Complete Logout Method (Clears Cookie & React State)
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error on backend:', error);
    } finally {
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  const value = { user, setUser, loading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook Export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;