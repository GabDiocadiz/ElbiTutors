import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Added .jsx extension for clarity

// FIX 1: Import the correct CSS file location
import './styles/globals.css'; 
// import './styles/design.css'; // Uncomment this if you want design.css instead

// FIX 2: Ensure AuthProvider comes from your hook
import { AuthProvider } from './hooks/useAuth.jsx'; // Added .jsx extension

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);