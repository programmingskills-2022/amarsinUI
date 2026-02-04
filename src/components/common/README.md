# Error Handling Components

This directory contains reusable components for handling errors throughout the application, particularly for query errors from React Query hooks.

## Components

### 1. ErrorPage
A comprehensive error page component that displays user-friendly error messages with retry and navigation options.

```tsx
import { ErrorPage } from '../components/common';

<ErrorPage
  error={query.error}
  isLoading={query.isLoading}
  onRetry={() => refetch()}
  onGoHome={() => navigate('/')}
  title="خطا در بارگذاری اطلاعات"
  showRetryButton={true}
  showHomeButton={true}
/>
```

### 2. QueryErrorHandler
A wrapper component that automatically handles query errors and loading states.

```tsx
import { QueryErrorHandler } from '../components/common';

<QueryErrorHandler
  error={query.error}
  isLoading={query.isLoading}
  onRetry={() => refetch()}
>
  {/* Your content here */}
  <div>Your data content</div>
</QueryErrorHandler>
```

### 3. ErrorBoundary
A React Error Boundary component that catches JavaScript errors anywhere in the component tree.

```tsx
import { ErrorBoundary } from '../components/common';

<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Component error:', error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## Hooks

### useErrorHandler
A custom hook that provides standardized error handling utilities.

```tsx
import { useErrorHandler } from '../hooks/useErrorHandler';

const MyComponent = () => {
  const { handleError, getErrorMessage, getErrorTitle, handleRetry, handleGoHome } = useErrorHandler();
  
  // Use the utilities...
};
```

## Usage Examples

### Basic Usage with Existing Hooks

```tsx
import { QueryErrorHandler } from '../components/common';
import { useBanks } from '../hooks/useBanks';

const BanksList = () => {
  const { isLoading, error, banks } = useBanks();

  return (
    <QueryErrorHandler
      error={error}
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      <div>
        <h2>لیست بانک‌ها</h2>
        {banks.map((bank, index) => (
          <div key={index}>{bank.name}</div>
        ))}
      </div>
    </QueryErrorHandler>
  );
};
```

### Advanced Usage with Custom Error Messages

```tsx
import { ErrorPage } from '../components/common';
import { useCustomers } from '../hooks/useCustomers';

const CustomersPage = () => {
  const { isLoading, error, customers } = useCustomers();

  if (error) {
    return (
      <ErrorPage
        error={error}
        title="خطا در بارگذاری مشتریان"
        message="نمی‌توانیم اطلاعات مشتریان را دریافت کنیم. لطفاً دوباره تلاش کنید."
        onRetry={() => window.location.reload()}
        showHomeButton={true}
      />
    );
  }

  if (isLoading) {
    return <ErrorPage isLoading={true} />;
  }

  return (
    <div>
      <h1>مشتریان</h1>
      {customers.map((customer, index) => (
        <div key={index}>{customer.name}</div>
      ))}
    </div>
  );
};
```

### Using with Error Boundary

```tsx
import { ErrorBoundary, QueryErrorHandler } from '../components/common';

const App = () => {
  return (
    <ErrorBoundary>
      <QueryErrorHandler
        error={query.error}
        isLoading={query.isLoading}
      >
        <YourMainContent />
      </QueryErrorHandler>
    </ErrorBoundary>
  );
};
```

## Error Types Handled

The error handling components automatically detect and provide appropriate messages for:

- **Network Errors**: Connection issues, offline state
- **Timeout Errors**: Request timeouts
- **Server Errors**: 5xx HTTP status codes
- **Authentication Errors**: 401 Unauthorized
- **Authorization Errors**: 403 Forbidden
- **Not Found Errors**: 404 Not Found
- **Generic Errors**: Any other error type

## Styling

All components use Tailwind CSS classes and are designed to be responsive. The error pages include:

- Persian/Farsi text support
- Responsive design
- Loading animations
- Consistent color scheme
- Accessibility features

## Development Features

In development mode (`NODE_ENV === 'development'`), the ErrorPage component includes:

- Technical error details
- Stack traces
- Error metadata

This information is hidden in production builds for security.
