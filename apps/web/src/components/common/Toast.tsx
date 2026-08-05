import React from 'react';
import { CheckCircle2, AlertTriangle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'emergency';
  title: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto glass-card p-4 rounded-2xl border flex items-start gap-3 shadow-glass animate-in fade-in slide-in-from-bottom-3 duration-300 ${
            toast.type === 'emergency'
              ? 'bg-red-950/80 border-red-500/40 text-red-100'
              : toast.type === 'success'
              ? 'bg-[#0E1B2E]/90 border-mint/30 text-white'
              : 'bg-[#0E1B2E]/90 border-darkBorder text-white'
          }`}
        >
          {toast.type === 'emergency' ? (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-mint shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1">
            <h4 className="text-xs font-bold tracking-wide uppercase text-gray-200">
              {toast.title}
            </h4>
            <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
