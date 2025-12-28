import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // null for not logged in, object for logged in user
  const [user, setUser] = useState(null);

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
