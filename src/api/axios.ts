import axios from 'axios';

// Use environment variable if available, otherwise default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use((config) => {
  // Retrieve the customer code from localStorage
  const customerCode = localStorage.getItem('customerCode');
  if (customerCode) {
    config.headers['xCustomerCode'] = customerCode;
  }

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token; 
  }

  return config;
});

// Add a response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Only redirect to login if we're not already there
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;


