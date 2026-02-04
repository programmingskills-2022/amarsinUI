import React from 'react';
import { AlertTriangle, RefreshCw, Home,  WifiOff } from 'lucide-react';

export interface ErrorPageProps {
  error?: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
  onGoHome?: () => void;
  title?: string;
  message?: string;
  showRetryButton?: boolean;
  showHomeButton?: boolean;
  className?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  isLoading = false,
  onRetry,
  onGoHome,
  title = "خطا در بارگذاری اطلاعات",
  message,
  showRetryButton = true,
  showHomeButton = true,
  className = ""
}) => {
  // Determine error type and message
  const getErrorDetails = () => {
    if (!error) {
      return {
        type: 'unknown',
        title: title,
        message: message || 'خطای نامشخص رخ داده است',
        icon: AlertTriangle
      };
    }

    // Network errors
    if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
      return {
        type: 'network',
        title: 'خطا در اتصال به شبکه',
        message: 'لطفاً اتصال اینترنت خود را بررسی کنید',
        icon: WifiOff
      };
    }

    // Timeout errors
    if (error.message.includes('timeout')) {
      return {
        type: 'timeout',
        title: 'زمان انتظار به پایان رسید',
        message: 'درخواست شما بیش از حد انتظار طول کشید',
        icon: AlertTriangle
      };
    }

    // Server errors (5xx)
    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return {
        type: 'server',
        title: 'خطا در سرور',
        message: 'خطایی در سرور رخ داده است. لطفاً بعداً تلاش کنید',
        icon: AlertTriangle
      };
    }

    // Client errors (4xx)
    if (error.message.includes('401')) {
      return {
        type: 'unauthorized',
        title: 'عدم دسترسی',
        message: 'شما دسترسی لازم برای مشاهده این اطلاعات را ندارید',
        icon: AlertTriangle
      };
    }

    if (error.message.includes('403')) {
      return {
        type: 'forbidden',
        title: 'دسترسی غیرمجاز',
        message: 'دسترسی شما به این بخش محدود شده است',
        icon: AlertTriangle
      };
    }

    if (error.message.includes('404')) {
      return {
        type: 'notFound',
        title: 'اطلاعات یافت نشد',
        message: 'اطلاعات مورد نظر شما پیدا نشد',
        icon: AlertTriangle
      };
    }

    // Generic error
    return {
      type: 'generic',
      title: title,
      message: message || error.message || 'خطای نامشخص رخ داده است',
      icon: AlertTriangle
    };
  };

  const errorDetails = getErrorDetails();
  const IconComponent = errorDetails.icon;

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}>
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">در حال بارگذاری...</h3>
        <p className="text-gray-500 text-center">لطفاً صبر کنید</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}>
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <IconComponent className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Error Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {errorDetails.title}
        </h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {errorDetails.message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetryButton && onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              تلاش مجدد
            </button>
          )}
          
          {showHomeButton && onGoHome && (
            <button
              onClick={onGoHome}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Home className="w-4 h-4 mr-2" />
              بازگشت به خانه
            </button>
          )}
        </div>

        {/* Technical Details (for development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              جزئیات فنی
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs font-mono text-gray-700 overflow-auto">
              <pre>{JSON.stringify({
                message: error.message,
                name: error.name,
                stack: error.stack
              }, null, 2)}</pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
