import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest} from '../types/auth'

export function useAuth() {
  const {
    userName,
    pass,
    playerId,
    customerTyp,
    appVer,
    xCustomerCode,
    isAppConfig,
    setToken,
    setAuthApiResponse,
    setError,
    menu,
    initData
  } = useAuthStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async () => {
      const body: LoginRequest = {
        userName,
        pass,
        playerId,
        customerTyp,
        appVer,
        xCustomerCode,
        isAppConfig,
        menu,
        initData
      }
      console.log('login info', body)
      const response = await api.post('/api/User/login', body)
      return response.data
    },
    onSuccess: (data) => {
      const { meta, data: responseData } = data
      const { errorCode, message } = meta

      console.log('Login response:', data)

      // Handle errorCode and message
      if (errorCode !== -1) {
        setError(errorCode, message) // Set error in the store
        console.error(message)
        return
      }

      // Successful login
      setToken(responseData?.result?.login.token)
      localStorage.setItem('customerCode', xCustomerCode)
      setAuthApiResponse(data)
      navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Login error:', error)
      //setError(-1, 'خطا در ورود به سیستم') // Set a default error message
    },
  })

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  }
} 