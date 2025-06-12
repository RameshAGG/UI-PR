import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have react-toastify installed
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { StatusCodes } from 'http-status-codes'; // Ensure you have this package installed
import { createBrowserHistory } from 'history';
import { decryptData } from '../storageHelper.ts';

const Axios = axios.create({
  baseURL: 'http://localhost:4000', // Removed /api since it's not needed
  // baseURL: 'http://13.202.234.244:4000/api' // Set your base URL here

});

const history = createBrowserHistory();

// Function to clear local storage
export const clearLocalStorage = () => {
  localStorage.clear();
};

// Request interceptor
Axios.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    const encryptedToken = localStorage.getItem('token');
    const token = decryptData(encryptedToken);
    
    // Initialize headers if they don't exist
    config.headers = config.headers || {};

    if (token) {
      // Set token in Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set other default headers
    config.headers['X-Frame-Options'] = 'SAMEORIGIN';
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    if (!navigator.onLine) {
      toast.info('You are currently offline!');
      throw new Error('You are offline');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized response
const handleUnauthorized = () => {
  clearLocalStorage();
  history.push('/login');
  toast.error('Session expired. Please login again.');
};

// Response interceptor
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case StatusCodes.UNAUTHORIZED:
        case StatusCodes.FORBIDDEN:
          handleUnauthorized();
          break;
        case StatusCodes.BAD_REQUEST:
          toast.error(response.data?.message || 'Bad Request');
          break;
        default:
          toast.error(response.data?.message || 'An error occurred');
          break;
      }
    } else {
      toast.error('Network error occurred');
    }

    return Promise.reject(error);
  }
);

// Setup function to initialize axios with token
export const setupAxiosInterceptors = () => {
  // const token = localStorage.getItem('token');
  const encryptedToken = localStorage.getItem('token');
  const token = decryptData(encryptedToken);
  if (token) {
    Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export default Axios;
