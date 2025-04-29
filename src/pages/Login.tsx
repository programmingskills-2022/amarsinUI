import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import Logo from '../assets/images/logo2.svg?react'
import Avatar from '../assets/images/avatar.svg?react'
import loginPic from '../assets/images/loginPic.png'

export default function Login() {
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [activationCode, setActivationCode] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const {
    userName, pass, setField
  } = useAuthStore()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!userName || !pass) {
      setError('لطفا نام کاربری و رمز عبور را وارد کنید')
      return
    }
    login()
  }

  const handleActivationCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activationCode) {
      setError('لطفا کد فعال‌ساز را وارد کنید')
      return
    }
    setField('xCustomerCode', activationCode)
    setShowCodeModal(false)
  }

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Right: Login card (now first for RTL) */}
      <div className="w-full md:w-[30%] flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm bg-white rounded-xl shadow p-8 flex flex-col items-center">
          <div className="w-full flex justify-start mb-2">
            <button onClick={() => setShowCodeModal(true)} className="text-gray-400 hover:text-gray-600">
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="bg-gray-100 rounded-full p-3 mb-2">

            <Avatar />
            </div>
            <div className="font-bold text-gray-700 text-base mb-1">ورود کاربران سیستم جامع آمارسین</div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded w-full mb-2 text-center text-sm" role="alert">
              {error}
            </div>
          )}
          <form className="w-full flex flex-col gap-3" onSubmit={handleLogin}>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setField('userName', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="نام کاربری"
              dir="rtl"
            />
            <input
              type="password"
              required
              value={pass}
              onChange={(e) => setField('pass', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="رمز عبور"
              autoComplete="current-password"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-2 rounded border-2 border-slate-500 text-slate-600 font-bold text-lg bg-white hover:bg-slate-50 transition disabled:opacity-50"
            >
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>
          {/* Status/info text */}
          <div className="w-full mt-6 text-xs text-gray-500 text-center space-y-1">
            <div>LocalDB13990901 لینک اطلاعاتی محلی</div>
            <div>ایجاد شد</div>
            <div>دریافت تنظیمات نرم افزار ....</div>
            <div>ارزیابی نسخه بانک اطلاعاتی ....</div>
            <div>ایجاد شد</div>
            <div>ایجاد شد</div>
            <div>بررسی قوانین و دسترسی‌ها ....</div>
            <div>ایجاد شد</div>
            <div className="mt-2"><a href="https://www.dotis.ir" className="text-blue-500 hover:underline">www.dotis.ir</a></div>
          </div>
        </div>
      </div>
      {/* Left: Background image and logo */}
      <div className="hidden md:flex w-[70%] h-screen flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${loginPic})` }}>
        <div className="flex flex-col items-start justify-start w-full h-full pt-8 pr-8">
          <Logo />
          <div className="text-gray-700 text-lg font-bold mb-2">آمارسین</div>
          <div className="text-gray-500 text-sm">تحقیق | طراحی | توسعه | پشتیبانی</div>
        </div>
      </div>
      {/* Activation code modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">تنظیم کد فعال‌ساز</h3>
            <form onSubmit={handleActivationCode}>
              <input
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                placeholder="کد فعال‌ساز"
                dir="rtl"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 