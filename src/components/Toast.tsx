import React from 'react';
import { useOutreach } from '../context/OutreachContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useOutreach();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            role="alert"
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white border border-slate-200 rounded-lg shadow-lg text-slate-800 transition-all duration-200 text-sm animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-600" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-600" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-indigo-600" />}
            </div>
            <div className="flex-1 font-medium text-xs leading-relaxed text-slate-700">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
