import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest} from '../types/auth'
import { useGeneralContext } from '../context/GeneralContext'

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

  const {setTreeNodeTitle}= useGeneralContext()
  
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

      //Successful login
      setToken(responseData?.result?.login.token)
      localStorage.setItem('customerCode', xCustomerCode)
      localStorage.setItem('token', responseData?.result?.login.token)
      setAuthApiResponse(data)

      // Check for workflow menu access
      const menu = responseData?.result?.menu || [];
      const hasWorkflow = (items: { path: string; children?: any[] }[]): boolean => {
        for (const item of items) {
          if (item.path === '/admin/WFMS/index') return true;
          if (item.children && hasWorkflow(item.children)) return true;
        }
        return false;
      };
      if (hasWorkflow(menu)) {
        navigate('/admin/WFMS/index');
      } else {
        navigate('/dashboard');
        setTreeNodeTitle('داشبورد')
      }
      
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