// In your main.jsx (or index.jsx) file:

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CoinContextProvider from './context/CoinContext';
import { AuthProvider } from './context/AuthContext'; 
import { NavigationProvider } from './context/NavigationContext';
// import './index.css'; // This line is duplicated, you can remove one if it is.
import { BrowserRouter } from 'react-router-dom';

// --- ADD THESE TWO LINES HERE ---
import axios from 'axios'; // Import axios
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
// If you are using Create React App, it would be:
// axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
// -------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <BrowserRouter>
    <GoogleOAuthProvider clientId="481025084065-272jm543jslcjd3ic6bnqb6gl1vmkt56.apps.googleusercontent.com">
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