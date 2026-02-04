import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface UseErrorHandlerReturn {
  handleError: (error: Error | null) => void;
  getErrorMessage: (error: Error | null) => string;
  getErrorTitle: (error: Error | null) => string;
  handleRetry: (retryFn: () => void) => () => void;
  handleGoHome: () => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const navigate = useNavigate();

  const getErrorTitle = useCallback((error: Error | null): string => {
    if (!error) return 'خطا در بارگذاری اطلاعات';

    if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
      return 'خطا در اتصال به شبکه';
    }

    if (error.message.includes('timeout')) {
      return 'زمان انتظار به پایان رسید';
    }

    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return 'خطا در سرور';
    }

    if (error.message.includes('401')) {
      return 'عدم دسترسی';
    }

    if (error.message.includes('403')) {
      return 'دسترسی غیرمجاز';
    }

    if (error.message.includes('404')) {
      return 'اطلاعات یافت نشد';
    }

    return 'خطا در بارگذاری اطلاعات';
  }, []);

  const getErrorMessage = useCallback((error: Error | null): string => {
    if (!error) return 'خطای نامشخص رخ داده است';

    if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
      return 'لطفاً اتصال اینترنت خود را بررسی کنید';
    }

    if (error.message.includes('timeout')) {
      return 'درخواست شما بیش از حد انتظار طول کشید';
    }

    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return 'خطایی در سرور رخ داده است. لطفاً بعداً تلاش کنید';
    }

    if (error.message.includes('401')) {
      return 'شما دسترسی لازم برای مشاهده این اطلاعات را ندارید';
    }

    if (error.message.includes('403')) {
      return 'دسترسی شما به این بخش محدود شده است';
    }

    if (error.message.includes('404')) {
      return 'اطلاعات مورد نظر شما پیدا نشد';
    }

    return error.message || 'خطای نامشخص رخ داده است';
  }, []);

  const handleError = useCallback((error: Error | null) => {
    if (!error) return;

    // Log error for debugging
    console.error('Application Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // You can add additional error handling logic here
    // For example, sending errors to a logging service
  }, []);

  const handleRetry = useCallback((retryFn: () => void) => {
    return () => {
      try {
        retryFn();
      } catch (error) {
        console.error('Retry failed:', error);
      }
    };
  }, []);

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    handleError,
    getErrorMessage,
    getErrorTitle,
    handleRetry,
    handleGoHome
  };
};
