import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // No longer directly used for Google signup here
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, googleSignup } = useAuth(); // Destructure googleSignup
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    console.log('SignUpPage - handleSubmit called'); 
    console.log('SignUpPage - Form data:', { username, email, password }); 
    try {
      await signup(username, email, password);
      console.log('SignUpPage - Signup function completed successfully'); 
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response && err.response.status === 409) {
        setError(err.response.data.error); 
      } else {
        setError('Signup failed. Please try again.'); 
      }
    }
  };

  const googleSignUp = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google onSuccess tokenResponse:', tokenResponse);
        const tokenToSendToBackend = tokenResponse.id_token || tokenResponse.access_token; // Correct variable name for consistency
        if (!tokenToSendToBackend) {
          throw new Error('Neither ID token or Access Token not found in Google response.');
        }
        console.log('Calling AuthContext googleSignup with token (substring):', tokenToSendToBackend.substring(0, 30) + '...');
        // Call the googleSignup function from AuthContext, which handles the backend call and state update
        await googleSignup(tokenToSendToBackend); // Pass only the ID token
        navigate('/dashboard');
      } catch (error) {
        console.error('Google sign-up failed:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Google sign-up failed. Please try again');
      }
    },
    onError: (errorResponse) => {
      console.error('Google sign-up error:', errorResponse);
      setError('Google sign-up failed.');
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Create an Account
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-600 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => googleSignUp()} // Call the googleSignUp function
            className="flex items-center justify-center w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          >
            <FaGoogle className="mr-2" />
            Sign-up with Google
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;