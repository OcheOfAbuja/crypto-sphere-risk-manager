// components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, googleSignup } = useAuth();
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

  // components/LoginPage.jsx
// ...
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoginError('');
  try {
    console.log('LoginPage: Attempting login with:', { identifier: emailOrUsername });
    // CALL THE AUTH CONTEXT LOGIN FUNCTION DIRECTLY WITH USER INPUTS
    const response = await login(emailOrUsername, password); // <--- CORRECTED LINE
    console.log('LoginPage: AuthContext login function completed. Response data:', response.data);
    // Now, perform the navigation AFTER the state update in AuthContext
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

// components/LoginPage.jsx
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const googleToken = tokenResponse.access_token;
      // Use the googleSignup function from AuthContext
      await googleSignup(googleToken);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error.response?.data?.message || error.message);
      setLoginError(error.response?.data?.message || 'Google login failed. Please try again.');
    }
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
            onClick={googleLogin}
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