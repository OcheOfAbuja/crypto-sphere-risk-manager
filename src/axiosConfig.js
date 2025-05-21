import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'; // For Vite
// OR if using Create-React-App:
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If you need to send cookies/credentials
});

export default axiosInstance;