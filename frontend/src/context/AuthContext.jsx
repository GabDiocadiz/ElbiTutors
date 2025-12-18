import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // tutee user
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'tutee',
    degree_program: '',
    classification: '',
    isLRCAdmin: false,
    picture: '',
    preferred_subjects: []
  });

  const login = () => {
    console.log("Google Login Triggered");
    // add google log in here
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};