import { Component } from 'react'

/**
 * Error Boundary - Catches JavaScript errors in child components
 * Displays a fallback UI instead of crashing the whole app
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    this.props.onRetry?.()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className={`${this.props.className || ''}`}>
          <ErrorDisplay
            title={this.props.title || "Something went wrong"}
            message={this.props.message || "We're sorry, but something unexpected happened."}
            error={this.state.error}
            showDetails={process.env.NODE_ENV === 'development'}
            onRetry={this.handleRetry}
            size={this.props.size || 'md'}
          />
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Error Display Component - Reusable error UI with retry button
 */
export function ErrorDisplay({
  title = "Something went wrong",
  message = "We couldn't complete your request. Please try again.",
  error = null,
  showDetails = false,
  onRetry,
  onGoBack,
  onGoHome,
  size = 'md',
  icon = 'error',
  className = '',
}) {
  const icons = {
    error: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    network: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
      </svg>
    ),
    notFound: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    empty: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  }

  const sizes = {
    sm: {
      container: 'py-6 px-4',
      icon: 'w-10 h-10',
      title: 'text-base',
      message: 'text-sm',
      button: 'text-sm px-3 py-1.5',
    },
    md: {
      container: 'py-10 px-6',
      icon: 'w-14 h-14',
      title: 'text-lg',
      message: 'text-base',
      button: 'text-sm px-4 py-2',
    },
    lg: {
      container: 'py-16 px-8',
      icon: 'w-20 h-20',
      title: 'text-2xl',
      message: 'text-lg',
      button: 'text-base px-6 py-3',
    },
  }

  const sizeClasses = sizes[size] || sizes.md

  return (
    <div className={`text-center ${sizeClasses.container} ${className}`}>
      {/* Icon */}
      <div className={`${sizeClasses.icon} mx-auto mb-4 text-gray-400 dark:text-gray-500`}>
        {icons[icon] || icons.error}
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-gray-900 dark:text-white mb-2 ${sizeClasses.title}`}>
        {title}
      </h3>

      {/* Message */}
      <p className={`text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto ${sizeClasses.message}`}>
        {message}
      </p>

      {/* Error Details (development only) */}
      {showDetails && error && (
        <details className="mb-6 text-left max-w-md mx-auto">
          <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-600">
            Show technical details
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
            {error.toString()}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className={`btn btn-primary ${sizeClasses.button}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
        {onGoBack && (
          <button
            onClick={onGoBack}
            className={`btn btn-secondary ${sizeClasses.button}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        )}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className={`btn btn-ghost ${sizeClasses.button}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Network Error Component - Specific UI for network/connection errors
 */
export function NetworkError({ onRetry, className = '' }) {
  return (
    <ErrorDisplay
      icon="network"
      title="Connection Problem"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
      className={className}
    />
  )
}

/**
 * Not Found Error Component - For 404 errors
 */
export function NotFoundError({
  title = "Not Found",
  message = "The page or resource you're looking for doesn't exist.",
  onGoBack,
  onGoHome,
  className = ''
}) {
  return (
    <ErrorDisplay
      icon="notFound"
      title={title}
      message={message}
      onGoBack={onGoBack}
      onGoHome={onGoHome}
      className={className}
    />
  )
}

/**
 * Empty State Component - For when there's no data
 */
export function EmptyState({
  title = "Nothing here yet",
  message = "There's no data to display.",
  action,
  actionLabel = "Get Started",
  className = '',
}) {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      {action && (
        <button onClick={action} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  )
}

/**
 * Inline Error - Small inline error message with retry
 */
export function InlineError({ message, onRetry, className = '' }) {
  return (
    <div className={`flex items-center gap-2 text-sm text-red-600 dark:text-red-400 ${className}`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-700 dark:text-red-300 hover:underline font-medium"
        >
          Retry
        </button>
      )}
    </div>
  )
}

/**
 * Error Toast - For showing temporary error notifications
 */
export function ErrorToast({ message, onDismiss, onRetry }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="flex-1 text-sm text-red-700 dark:text-red-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-red-700 dark:text-red-300 hover:underline"
        >
          Retry
        </button>
      )}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
