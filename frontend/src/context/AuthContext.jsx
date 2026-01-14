import { createContext, useState } from 'react';
import { mockUser } from '../utils/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // For testing, use mockUser. In production, this should be null initially
  const [user, setUser] = useState(mockUser);

  const login = () => {
    console.log("Google Login Triggered");
    // TODO: Implement actual Google OAuth login here
    // For now, return the mockUser for testing
    setUser(mockUser);
    return user;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
