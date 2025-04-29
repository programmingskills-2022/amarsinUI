import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: 'http://api.dotis.ir',
})

api.interceptors.request.use((config) => {
  const customerCode = localStorage.getItem('customerCode')
  if (customerCode) {
    config.headers['xCustomerCode'] = customerCode
  }
  return config
})

export default api 