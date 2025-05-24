import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CoinContextProvider from './context/CoinContext';
import { AuthProvider } from './context/AuthContext'; 
import { NavigationProvider } from './context/NavigationContext';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  console.error("Google Client ID is not defined! Google login will not work.");
  // You might want to throw an error or display a warning to the user
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    {GOOGLE_CLIENT_ID && (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CoinContextProvider>
        <NavigationProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </NavigationProvider>
      </CoinContextProvider>
    </GoogleOAuthProvider>
    )}
    {!GOOGLE_CLIENT_ID && (
      <div>Error: Google login not configured. Please set VITE_GOOGLE_CLIENT_ID.</div>
    )}
    </BrowserRouter>
  </React.StrictMode>
);