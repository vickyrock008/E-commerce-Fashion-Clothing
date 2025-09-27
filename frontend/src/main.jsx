import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
// ✨ 1. Import the UserContextProvider
import UserContextProvider from './context/UserContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* ✨ 2. Wrap the <App /> component with our new provider */}
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);