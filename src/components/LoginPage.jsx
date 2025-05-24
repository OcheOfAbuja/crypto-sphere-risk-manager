import React, { useState, useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
// import axios from 'axios'; // No longer directly used for Google login here

function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, googleSignup } = useAuth(); // Destructure googleSignup
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmailOrUsername = localStorage.getItem('rememberedEmailOrUsername');
    if (storedEmailOrUsername) {
      setEmailOrUsername(storedEmailOrUsername);
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'emailOrUsername') {
      setEmailOrUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      console.log('LoginPage: Attempting login with:', { identifier: emailOrUsername });
      const response = await login(emailOrUsername, password);
      console.log('LoginPage: AuthContext login function completed. Response data:', response.data);
      console.log('LoginPage: Calling navigate to /dashboard...');
      navigate('/dashboard'); 
      console.log('LoginPage: navigate("/dashboard") has been called.');

      if (rememberMe) {
        localStorage.setItem('rememberedEmailOrUsername', emailOrUsername);
      } else {
        localStorage.removeItem('rememberedEmailOrUsername');
      }
    } catch (error) {
      console.error('LoginPage: Login failed:', error.response?.data?.error || error.message);
      setLoginError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const googleLogin = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google onSuccess tokenResponse:', tokenResponse);
        const googleAccesToken = tokenResponse.access_token; // Correctly get the ID token
        if (!googleAccesToken) {
          throw new Error('Google Access token not found in response.');
        }
        console.log('Calling AuthContext googleSignup with token:', googleAccessToken);
        // Call the googleSignup function from AuthContext, which handles the backend call and state update
        await googleSignup(googleAccessToken); // Pass only the ID token
        navigate('/dashboard');
      } catch (error) {
        console.error('Google login failed:', error.response?.data?.message || error.message);
        setLoginError(error.response?.data?.message || 'Google login failed. Please try again.');
      }
    },
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      setLoginError('Google login failed.'); // Using setLoginError for consistency
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Crypto Sphere Risk Manager
        </h2>
        {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="emailOrUsername" className="block text-gray-600 text-sm font-medium mb-2">
              Email or Username
            </label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              value={emailOrUsername}
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
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="mr-2 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="text-gray-600 text-sm">
              Remember Me
            </label>

            <Link to="forgetpasswordpage" className="text-blue-500 hover:underline text-sm px-2">
              Forgot Password?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center my-4">
          <div className="border-t border-gray-300 w-1/3" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <div className="border-t border-gray-300 w-1/3" />
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={googleLogin} // Call the googleLogin function
            className="flex items-center justify-center w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          >
            <FaGoogle className="mr-2" />
            Sign-in with Google
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;