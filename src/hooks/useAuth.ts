import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest, UserInfo, AppConfig } from '../types/auth'

export function useAuth() {
  const {
    userName, pass, playerId, customerTyp, appVer, xCustomerCode, isAppConfig, setToken, setUserInfo, setAppConfig
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
        isAppConfig
      }
      const response = await api.post('/api/User/login', body)
      console.log('login info',response.data)
      return response.data
    },
    onSuccess: (data) => {
      const userInfo: UserInfo = data?.data?.result?.login
      const appConfig: AppConfig = data?.data?.result?.appConfig
      setToken(userInfo.token)
      setUserInfo(userInfo)
      setAppConfig(appConfig)
      navigate('/dashboard')
    },
  })

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  }
} 