import axios from 'axios';

const api = axios.create({
  baseURL: 'http://apitest.dotis.ir',
  //baseURL: 'http://localhost:5042',
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
      window.location.href = '/login'; // Adjust if your login route is different
    }
    return Promise.reject(error);
  }
);

export default api;


