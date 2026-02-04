import React from 'react';
import ErrorPage from './ErrorPage';
import { useErrorHandler } from '../../hooks/useErrorHandler';

interface QueryErrorHandlerProps {
  error?: Error | null;
  isLoading?: boolean;
  children: React.ReactNode;
  onRetry?: () => void;
  title?: string;
  message?: string;
  showRetryButton?: boolean;
  showHomeButton?: boolean;
  className?: string;
}

const QueryErrorHandler: React.FC<QueryErrorHandlerProps> = ({
  error,
  isLoading = false,
  children,
  onRetry,
  title,
  message,
  showRetryButton = true,
  showHomeButton = true,
  className
}) => {
  const { getErrorTitle, getErrorMessage, handleRetry, handleGoHome } = useErrorHandler();

  // If there's an error, show the error page
  if (error) {
    return (
      <ErrorPage
        error={error}
        onRetry={onRetry ? handleRetry(onRetry) : undefined}
        onGoHome={handleGoHome}
        title={title || getErrorTitle(error)}
        message={message || getErrorMessage(error)}
        showRetryButton={showRetryButton}
        showHomeButton={showHomeButton}
        className={className}
      />
    );
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <ErrorPage
        isLoading={true}
        className={className}
      />
    );
  }

  // If no error and not loading, render children
  return <>{children}</>;
};

export default QueryErrorHandler;
