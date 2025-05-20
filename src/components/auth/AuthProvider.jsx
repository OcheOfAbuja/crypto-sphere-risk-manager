import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking for an existing session (e.g., token in localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      // Simulate a logged-in user
      setUser({ name: 'John Doe', email: 'john.doe@example.com' }); // Or get user data from token
    }
    setLoading(false);
  }, []);

  const authContextValue = {
    user,
    loading,
    signUp: async (email, password) => {
      // Simulate a successful signup
      console.log('Simulating sign up for ', email, password);
      localStorage.setItem('authToken', 'fake-auth-token');
      const fakeUser = { name: 'John Doe', email };
      setUser(fakeUser);
      return { user: fakeUser };
    },
    signIn: async (email, password) => {
      // Simulate a successful signin
      console.log('Simulating sign in for ', email, password);
      localStorage.setItem('authToken', 'fake-auth-token');
      const fakeUser = { name: 'John Doe', email };
      setUser(fakeUser);
      return { user: fakeUser };
    },
    signOut: () => {
      console.log('Simulating sign out');
      localStorage.removeItem('authToken');
      setUser(null);
      navigate('/');
    },
    signInWithGoogle: async () => {
      console.log('Simulating sign in with google');
      localStorage.setItem('authToken', 'fake-auth-token');
      const fakeUser = { name: 'John Doe', email: 'john.doe@example.com' };
      setUser(fakeUser);
      return { user: fakeUser };
    },
    sendEmailVerification: async (email) => {
      console.log('Simulating sending email verification to ', email);
      return Promise.resolve();
    },
    updatePassword: async (password) => {
      console.log('Simulating password update', password);
      return Promise.resolve();
    },
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
