import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL
  : 'http://localhost:5001';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useParams(); 
  const navigate = useNavigate();
  

  useEffect(() => {
    // Verify the token on component mount
    const verifyToken = async () => {
      setLoading(true);
      setError('');
      if (!token){
        setError('No reset link provided.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(`${BACKEND_URL}/api/verify-reset-token`, { token });
        if (response.data.valid) {
          setTokenValid(true);
        } else {
          setError('Invalid or expired reset link.');
        }
      } catch (err) {
        console.error("Token verificatio failed:", err);
        setError(err.response?.data?.error || 'Failed to verify reset link. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      verifyToken();
    } else {
      setError('No reset link provided.');
      setLoading(false);
    }
  }, [token]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/reset-password`, { token, password });
      setMessage(response.data.message || 'Password reset successfully!');
      // Optionally, redirect the user to the login page after a short delay
      setTimeout(() => {
      navigate('/');
      }, 2000);
    } catch (err) {
      console.error("Password reset failed:", err);
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='text-grey-700 text-lg'>Loading</div>
      </div>
    );
  }

  if (error && !tokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
            Reset Your Password
          </h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <p className="text-gray-600 mb-4">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <p className="text-center">
            <Link to="/forgetpasswordpage" className="text-blue-500 hover:underline">

              Request New Link
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Reset Your Password
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-600 text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Reset Password
            </button>
          </div>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Remember your new password?{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;