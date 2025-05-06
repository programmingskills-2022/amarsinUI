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
      token: null,
      isAuthenticated: false,
      userInfo: null,
      appConfig: null,
      setField: (field, value) => set((state) => ({ ...state, [field]: value })),
      setToken: (token) => set({ token, isAuthenticated: true }),
      setUserInfo: (userInfo) => set({ userInfo }),
      setAppConfig: (appConfig) => set({ appConfig }),
      logout: () => set({
        userName: '',
        pass: '',
        playerId: '',
        customerTyp: 0,
        appVer: '1.0.0',
        //xCustomerCode: '',
        isAppConfig: true,
        token: null,
        isAuthenticated: false,
        userInfo: null,
        appConfig: null,
      }),
    }),
    { name: 'auth-storage' }
  )
) 