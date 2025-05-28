import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const DEFAULT_API_BASE_URL = 'http://localhost:5001';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
console.log ('API Base URL being used:', apiBaseUrl);
//console.log('AuthContext: API Base URL resolved from environment:', apiBaseUrl);

if (!apiBaseUrl) {
  console.error(
    "CRITICAL: VITE_API_BASE_URL is not defined! API calls will fail.",
    "Ensure it's set in your .env file locally and in Netlify environment variables for deployment."
  );
}

const API = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  console.log(`Axios Request: ${config.method.toUpperCase()} ${config.baseURL} ${config.url}`);
  return config;
});

API.interceptors.response.use((response) => {
  console.log(`Axios Response: ${response.config.method.toUpperCase()} ${response.config.baseURL} ${response.config.url} - Status: ${response.status}`);
  return response;
},
(error) => {
  if (error.response) {
    console.error(`Axios Response Error (${error.response.status}): ${error.response.config.method.toUpperCase()} ${error.config.baseURL} ${error.config.baseURL} ${error.config.url}`, error.response.data );
    if (error.response.status === 401) {
      console.warn('Unauthorized request detected. User migt need to re-login.');
    } else if (error.response.status === 404) {
      console.error(`404 Not Found: Check the API endpoint path and the VITE_API_BASE_URL.`);
    }
  } else if (error.request) {
    console.error('Axios No Response Error: The request was made but no response was received. Check network connectivity or backend server status.', error.message);
  } else {
    console.error('Axios Request Setup Error:', error.message);
  }
  return Promise.reject(error);
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect to load token and user from localStorage on initial mount
  useEffect(() => {
    console.log('AuthContext - First useEffect (on mount)');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
        console.log('AuthContext - First useEffect - Token and user loaded from localStorage:', storedToken?.substring(0, 10) + '...', JSON.parse(storedUser));
      } catch (e) {
        console.error('AuthContext - Error parsing stored user data:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
    console.log('AuthContext - First useEffect - Loading set to false');
  }, []);

  useEffect(() => {
    console.log('AuthContext - Second useEffect (token or user changed)', token, user);
    if (token) {
      localStorage.setItem('token', token);
      console.log('AuthContext - Second useEffect - Token saved to localStorage:', token?.substring(0, 10) + '...');
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      console.log('AuthContext - Second useEffect - Token removed from localStorage');
      delete API.defaults.headers.common['Authorization'];
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('AuthContext - Second useEffect - User saved to localStorage:', user);
    } else {
      localStorage.removeItem('user');
      console.log('AuthContext - Second useEffect - User removed from localStorage');
    }
  }, [token, user]);

  const login = async (identifier, password) => { 
    setLoading(true);
    try {
      console.log('AuthContext: Attempting login for identifier:', identifier);
      const response = await API.post('/api/login', { identifier, password }); 
      const { token: loginToken, user: loginUser } = response.data;
      
      setToken(loginToken);
      setUser(loginUser);
      setLoading(false);
      console.log('AuthContext: Login successful, token and user set.');
      return response; 
    } catch (error) {
      console.error('AuthContext: Login failed:', error.response?.data?.error || error.message); 
      setToken(null);
      setUser(null);
      setLoading(false);
      throw error; 
    }
  };

  const logout = async () => {
    console.log('AuthContext: Logout initiated.');
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await API.post('/api/logout', {}, { headers });
      console.log('AuthContext: Backend logout successful:', response.data.message);
    } catch (error) {
      console.error('AuthContext: Error during backend logout:', error.response?.data?.message || error.message);
    } finally {
      console.log('AuthContext: Navigated to /login after logout.');
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true); 
    try {
      console.log('AuthContext: Attempting signup for username:', username, 'email:', email);
      const response = await API.post('/api/signup', { username, email, password });
      const { token: signupToken, user: signupUser } = response.data;
      
      setToken(signupToken);
      setUser(signupUser);
      setLoading(false);
      console.log('AuthContext: Signup successful, token and user set.');
      return response;
    } catch (error) {
      console.error('AuthContext: Signup failed:', error.response?.data?.error || error.message);
      setLoading(false); 
      throw error; 
    }
  };

  const googleSignup = async (googleTokenFromFrontend) => { // This function is correct as is
    setLoading(true); 
    try {
      console.log('AuthContext: Attempting Google signup/login with token...');
      if (!googleTokenFromFrontend) {
        throw new Error('Google token was not provided to googleSignup function.');
      }

      const response = await API.post('/api/google-login', { token: googleTokenFromFrontend });
      const { token: googleTokenResponse, user: googleUser } = response.data;
      
      setToken(googleTokenResponse);
      setUser(googleUser);
      setLoading(false);
      console.log('AuthContext: Google signup/login successful, token and user set.');
      return response;
    } catch (error) {
      console.error('AuthContext: Google signup/login failed:', error.response?.data?.error || error.message);
      setLoading(false); 
      throw error;
    }
  };

  const isAuthenticated = !!token && !!user; 

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, signup, googleSignup, isAuthenticated }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};