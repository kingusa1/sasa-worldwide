'use client';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBanner({ title = 'Something went wrong', message, onRetry, className = '' }: ErrorBannerProps) {
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm text-red-800 font-medium">{title}</p>
          <p className="text-xs text-red-600 mt-1 font-mono break-all">{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="mt-2 text-xs font-medium text-red-700 underline hover:text-red-900">
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ServerError({ title, message }: { title?: string; message: string }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <p className="text-sm text-red-800 font-medium">{title || 'Data loading error'}</p>
          <p className="text-xs text-red-600 mt-1 font-mono break-all">{message}</p>
        </div>
      </div>
    </div>
  );
}
