import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CoinContextProvider from './context/CoinContext';
import { AuthProvider } from './context/AuthContext'; 
import { NavigationProvider } from './context/NavigationContext';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId="647555831129-lciav0j4hotvj6omdu1p3ra197mkq520.apps.googleusercontent.com">
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