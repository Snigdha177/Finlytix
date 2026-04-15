import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (event) => {
      setHasError(true);
      setError(event.message);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-950">
        <div className="card max-w-md p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-danger" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Something went wrong!
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => {
              setHasError(false);
              window.location.reload();
            }}
            className="btn-primary w-full"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full" />
      </div>
    </div>
  );
}

export function NoDataMessage({ title = 'No data found', description = '' }) {
  return (
    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
      <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p className="text-lg font-medium">{title}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
}

export function SuccessMessage({ message, onClose }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
      <p className="text-sm text-green-700 dark:text-green-400">{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-auto text-green-700 hover:text-green-900">
          ✕
        </button>
      )}
    </div>
  );
}
