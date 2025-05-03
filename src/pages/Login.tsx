import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import Logo2 from '../assets/images/logo2.svg?react'
import Logo from '../assets/images/logo.svg?react'
import Avatar from '../assets/images/avatar.svg?react'
import loginPic from '../assets/images/loginPic.png'
import logoAvatar from '../assets/images/logo-Avatar.png'
import SplashLogo from '../assets/images/Splash-Logo.png'
import AmarsinSplash from '../assets/images/AmarsinSplash.png'

export default function Login() {
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [activationCode, setActivationCode] = useState('')
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(false)
  const { login, isLoading } = useAuth()
  const {
    userName, pass, setField
  } = useAuthStore()

  const submitButtonRef = useRef<HTMLButtonElement>(null) // Create a ref for the button

  useEffect(() => {
    // Set focus on the submit button when the component mounts
    if (submitButtonRef.current) {
      submitButtonRef.current.focus()
    }
  }, [])

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
    <div className="h-screen flex overflow-hidden" dir="rtl">
      {/* Right: Login card (now first for RTL) */}
      <div className="h-full w-full md:w-[20%] flex items-center justify-center bg-gray-100">
        <div className="h-full w-full max-w-sm p-2 flex flex-col items-center">
          <div className="w-full flex justify-start mb-2">
            <button onClick={() => setShowCodeModal(true)} className="text-gray-400 hover:text-gray-600">
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="w-full h-full flex flex-col items-center">
            {/* avatar here */}
            <img src={logoAvatar} />
            <div className="bg-gray-300 w-full h-full flex flex-col items-center rounded-xl pt-4">
              <Logo className="opacity-20" />
              <label className="font-bold text-gray-700 text-base mt-6 mb-1">
                ورود کاربران سیستم جامع آمارسین
              </label>
              <form className="w-full flex flex-col gap-3 p-4" onSubmit={handleLogin}>
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
                  ref={submitButtonRef} // Attach the ref to the button
                  className="mt-2 w-full py-2 rounded border-2 border-red-500 text-red-600 font-bold text-lg bg-white hover:bg-red-50 transition disabled:opacity-50"
                >
                  {isLoading ? 'در حال ورود...' : 'ورود'}
                </button>
              </form>
              <div className="w-full flex flex-col items-center justify-between border-t-2 mt-2 border-gray-400 py-4">
                <div className="w-full flex items-center justify-center mt-2 border-gray-400">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="ml-2"
                  />
                  <label htmlFor="remember" className="text-xs font-bold text-gray-700 cursor-pointer">
                    اطلاعات ورود را بخاطر بسپار
                  </label>
                </div>
                <label htmlFor="remember" className="text-xs font-bold text-gray-700 cursor-pointer">
                  www.dotis.ir
                </label>
              </div>
            </div>
          </div>
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded w-full mb-2 text-center text-sm"
              role="alert"
            >
              {error}
            </div>
          )}
        </div>
      </div>
      {/* Left: Background image and logo */}
      <div
        className="hidden md:flex w-[80%] h-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${AmarsinSplash})` }}
      >
        <div className="flex flex-col items-start justify-start w-1/4 h-full pt-4">
          <img src={SplashLogo} />
        </div>
        <div className="flex flex-col h-full justify-end items-center w-1/2">
          <label className="w-full text-center p-2 bg-gradient-to-r from-transparent via-gray-100 to-transparent mb-2">
            شما به کارتون برسید حساب کتابش با ما
          </label>
        </div>
        <div className="flex flex-col items-center justify-start h-full pt-8 mt-28 w-1/4">
          <Logo className="opacity-10" />
          <div className="text-gray-500 text-sm pt-4">تحقیق </div>
          <div className="text-gray-500 text-sm">طراحی </div>
          <div className="text-gray-500 text-sm">توسعه </div>
          <div className="text-gray-500 text-sm">پشتیبانی</div>
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