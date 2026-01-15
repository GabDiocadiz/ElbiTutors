import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Library for Google Login
import App from './App';
import { AuthProvider } from './hooks/useAuth'; 
import './styles/globals.css';

/**
 * Note: To use the "Login with Google" feature, you must register your app 
 * in the Google Cloud Console (https://console.cloud.google.com/). 
 * * 1. Create a Project.
 * 2. Go to "APIs & Services" > "Credentials".
 * 3. Create an "OAuth 2.0 Client ID".
 * 4. Add "http://localhost:5173" to "Authorized JavaScript origins".
 */
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* We wrap the app in GoogleOAuthProvider so the Login page 
      can trigger the real Google Sign-In popup.
    */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);