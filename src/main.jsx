import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CoinContextProvider from './context/CoinContext';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import { BrowserRouter } from 'react-router-dom';

// Get the Google Client ID from environment variables, with a fallback
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ;

// Add a console log to see which Client ID is being used in the browser console
// This is extremely helpful for debugging deployed environments
console.log('Google OAuth Client ID being used:', googleClientId);

// Optional: Add a runtime check to warn if the client ID is missing
// This helps catch issues during development or if env vars are misconfigured
if (!googleClientId) {
  console.error(
    "Critical Error: VITE_GOOGLE_CLIENT_ID is not defined. Google Sign-In will not function correctly.",
    "Please ensure it's set in your .env file locally and in Netlify environment variables for deployment."
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Use the dynamically resolved googleClientId here */}
      <GoogleOAuthProvider clientId={googleClientId}>
        <CoinContextProvider>
          <NavigationProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </NavigationProvider>
        </CoinContextProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);