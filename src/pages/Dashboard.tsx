<<<<<<< HEAD
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { Squares2X2Icon } from '@heroicons/react/24/outline'

const menuItems = [
  'تعاریف و عملیات','ارتباط با مشتری','انبارداری','تولید','حسابداری','حقوق و دستمزد','اموال','بودجه و اعتبارات'
]

export default function Dashboard() {
  const { logout, userInfo, appConfig } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      {/* Top blue header */}
      <header className="bg-blue-700 text-white flex items-center justify-between px-4 h-10">
        <div className="flex items-center">
          <img src="/vite.svg" alt="logo" className="h-6 mr-2" />
          <span className="font-bold text-lg">Amarsin</span>
        </div>
        <div className="text-center flex-1 font-bold text-base">{appConfig?.systemTitle || 'آمارسین'}</div>
        <div className="flex items-center space-x-2">
          <span className="text-xs">{userInfo?.nam || 'کاربر سیستم'}</span>
          <button
            onClick={handleLogout}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded px-2 py-1 text-xs ml-2"
          >
            خروج
          </button>
        </div>
      </header>
      {/* Sub-header */}
      <div className="bg-blue-100 text-blue-900 px-4 py-2 flex items-center justify-between text-xs">
        <span>سیستم: {appConfig?.systemTitle || '...'}</span>
        <span>سال مالی: {appConfig?.acc_Year || '...'}</span>
        <span>{userInfo?.nam || 'کاربر سیستم'}</span>
        <span dir="rtl">
          {new Date().toLocaleDateString('fa-IR', { weekday: 'long' })} {new Date().toLocaleDateString('fa-IR', { day: 'numeric' })} {new Date().toLocaleDateString('fa-IR', { month: 'long' })} {new Date().toLocaleDateString('fa-IR', { year: 'numeric' })}
        </span>
      </div>
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-2 font-bold border-b border-gray-200">منوی نرم افزار</div>
          <ul className="text-sm">
            {menuItems.map((item, idx) => (
              <li
                key={item}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-50 ${idx === 30 ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                <Squares2X2Icon className="w-5 h-5 text-blue-400" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
        {/* Center content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <img
            src="/dashboard-illustration.png"
            alt="dashboard"
            className="w-64 h-64 object-contain opacity-80"
            style={{ marginTop: '40px' }}
          />
=======
export default function Dashboard() {
  
  return (
    <div className="min-h-screen overflow-y-hidden flex flex-col bg-gray-200">
      {/* Top blue header */}
      {/* <header className="bg-blue-700 text-white flex items-center justify-between px-4 h-10">

      </header> */}
      {/* Sub-header */}
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          این صفحه فقط برای تست می باشد
>>>>>>> cee5e85 (create menu)
        </main>
      </div>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between">
<<<<<<< HEAD
        <span>آمارسین</span>
        <span>{new Date().toLocaleString('fa-IR')}</span>
=======

>>>>>>> cee5e85 (create menu)
      </footer>
    </div>
  )
} 