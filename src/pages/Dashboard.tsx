import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { Squares2X2Icon } from '@heroicons/react/24/outline'

const menuItems = [
  'ارتباط با مشتریان', 'مدیریت مشتریان', 'بازاریابی', 'فروش', 'دریافت و پرداخت', 'بانک',
  'مشخصات نامه ها', 'جستجوی نامه', 'بستن حسابها', 'سند حساب', 'اسناد مالی', 'اسناد متفرقه',
  'گزارشات مالی', 'گزارشات مدیریتی', 'کدینگ حسابها', 'کدینگ مراکز', 'کدینگ پروژه', 'کدینگ کالا',
  'کدینگ اشخاص', 'کدینگ انبار', 'کدینگ خودرو', 'کدینگ پرسنل', 'کدینگ مشتری', 'کدینگ فروشنده',
  'کدینگ خدمات', 'کدینگ هزینه', 'کدینگ درآمد', 'کدینگ دارایی', 'کدینگ سرمایه', 'کدینگ بدهی',
  'کدینگ حقوق و دستمزد', 'انبار', 'لیست کاربران', 'لیست استفاده', 'لیست کالا', 'لیست مشتری',
  'لیست فروشنده', 'لیست خدمات', 'لیست هزینه', 'لیست درآمد', 'لیست دارایی', 'لیست سرمایه',
  'لیست بدهی', 'لیست حقوق و دستمزد', 'لیست انبار', 'لیست خودرو', 'لیست پرسنل', 'لیست پروژه',
  'لیست مراکز', 'لیست حسابها', 'لیست مالی', 'لیست مدیریتی', 'لیست متفرقه', 'لیست گزارشات',
  'لیست گزارشات مالی', 'لیست گزارشات مدیریتی', 'لیست گزارشات متفرقه',
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
        <span>{new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-l border-gray-200 h-full overflow-y-auto">
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
        </main>
      </div>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between">
        <span>آمارسین</span>
        <span>{new Date().toLocaleString('fa-IR')}</span>
      </footer>
    </div>
  )
} 