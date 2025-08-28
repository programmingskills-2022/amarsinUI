import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState } from '../types/auth'

// Check if there's a valid token in localStorage
const getInitialAuthState = () => {
  const token = localStorage.getItem('token')
  return {
    isAuthenticated: !!token,
    token: token
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userName: '',
      pass: '',
      playerId: '',
      customerTyp: 0,
      appVer: '1.0.0',
      xCustomerCode: '',
      isAppConfig: true,
      menu: true,
      initData: true,
      token: getInitialAuthState().token,
      isAuthenticated: getInitialAuthState().isAuthenticated,
      authApiResponse: null,
      userInfo: null,
      appConfig: null,
      errorCode: -1,
      message: '',
      setAuthApiResponse: (authApiResponse) => set({ authApiResponse }),
      setField: (field, value) => set((state) => ({ ...state, [field]: value })),
      setToken: (token) => {
        localStorage.setItem('token', token)
        set({ token, isAuthenticated: true })
      },
      setError: (errorCode, message) => set({ errorCode, message }),
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('customerCode')
        set({
          //userName: '',
          //pass: '',
          playerId: '',
          customerTyp: 0,
          appVer: '1.0.0',
          menu: true,
          initData: true,
          isAppConfig: true,
          token: null,
          isAuthenticated: false,
          authApiResponse: null,
          errorCode: -1,
          message: ''
        })
      },
    }),
    { name: 'auth-storage' }
  )
) 