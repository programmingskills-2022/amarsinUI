import axios from 'axios'
<<<<<<< HEAD
import { useAuthStore } from '../store/authStore'
=======
>>>>>>> cee5e85 (create menu)

const api = axios.create({
  baseURL: 'http://apitest.dotis.ir',
})

api.interceptors.request.use((config) => {
  const customerCode = localStorage.getItem('customerCode')
  if (customerCode) {
    config.headers['xCustomerCode'] = customerCode
  }
  return config
})

export default api 