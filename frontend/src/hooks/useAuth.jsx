import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // This connects to your backend (Port 4000)

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is already logged in (Check LocalStorage)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          setUser(JSON.parse(storedUser)); // Restore user data
        }
      } catch (error) {
        console.error("Auth restoration failed", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  // 2. Login Function (Calls YOUR Backend)
  const login = async (email, password) => {
    try {
      // Calls http://localhost:4000/api/auth/login
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;

      // Save to LocalStorage so they stay logged in
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login'; // Force redirect
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);