import axios from 'axios';

const api = axios.create({
  baseURL: 'http://apitest.dotis.ir',
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
    config.headers['Authorization'] = `Bearer ${token}`; // Add token to Authorization header
  }

  return config;
});

export default api;