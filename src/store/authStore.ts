import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState } from '../types/auth'

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
      menu:true,
      initData:true,
      token: null,
      isAuthenticated: false,
      authApiResponse: null,
      userInfo: null,
      appConfig: null,
      errorCode:-1,
      message:'',
      setAuthApiResponse:(authApiResponse)=>set({authApiResponse}),
      setField: (field, value) => set((state) => ({ ...state, [field]: value })),
      setToken: (token) => set({ token, isAuthenticated: true }),
      setError: (errorCode,message)=>set({errorCode,message}),
      // setUserInfo: (userInfo) => set({ userInfo }),
      // setAppConfig: (appConfig) => set({ appConfig }),
      logout: () => set({
        userName: '',
        pass: '',
        playerId: '',
        customerTyp: 0,
        appVer: '1.0.0',
        menu:true,
        initData:true,
        //xCustomerCode: '',
        isAppConfig: true,
        token: null,
        isAuthenticated: false,
        authApiResponse:null,
        errorCode:-1,
        message:''
        // userInfo: null,
        // appConfig: null,
      }),
    }),
    { name: 'auth-storage' }
  )
) 