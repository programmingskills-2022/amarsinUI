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
    config.headers['Authorization'] = token; // No 'Bearer '
  }

  return config;
});

export default api;