import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 relative">
        {/* 404 Number */}
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold text-slate-600 leading-none mb-6 drop-shadow-lg">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          صفحه مورد نظر یافت نشد
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mb-12 max-w-lg leading-relaxed">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است حذف شده باشد.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-2.5 text-base bg-slate-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            بازگشت به صفحه اصلی
          </button>

          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-2.5 text-base border-2 border-slate-600 text-slate-600 rounded-lg hover:-translate-y-0.5 transition-all duration-300 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            بازگشت به صفحه قبل
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-[10%] left-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 -z-10" />
        <div className="absolute bottom-[10%] right-[10%] w-36 h-36 rounded-full bg-gradient-to-br from-slate-50 to-slate-25 -z-10" />
      </div>
    </div>
  );
};

export default NotFound;
