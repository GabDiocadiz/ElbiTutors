import { createContext, useState } from 'react';
import { mockUser } from '../utils/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // For testing, use mockUser. In production, this should be null initially
  const [user, setUser] = useState(mockUser);

  const login = () => {
    console.log("Google Login Triggered");
    // add google log in here
    // Example: after successful login, call setUser with user data
    // setUser({
    //   name: '',
    //   email: '',
    //   role: 'tutee',
    //   degree_program: '',
    //   classification: '',
    //   isLRCAdmin: false,
    //   picture: '',
    //   preferred_subjects: []
    // });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
