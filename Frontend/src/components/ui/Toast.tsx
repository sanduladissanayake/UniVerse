import React, { useEffect, useState } from 'react';
import { X, Check, AlertCircle, Info, Bell } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'announcement';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  title?: string;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ id, message, type, onClose, title }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const duration = type === 'announcement' ? 8000 : 5000; // announcements stay longer
    
    timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300); // Allow exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onClose, type]);

  const getStyles = () => {
    const baseClasses = 'rounded-lg shadow-lg p-4 mb-3 flex items-start gap-3 animate-in fade-in slide-in-from-right-2 duration-300 transition-all';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border border-green-200 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border border-red-200 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border border-yellow-200 text-yellow-800`;
      case 'announcement':
        return `${baseClasses} bg-blue-50 border border-blue-200 text-blue-800`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-50 border border-blue-200 text-blue-800`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600" />;
      case 'announcement':
        return <Bell className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />;
    }
  };

  return (
    <div
      className={`${getStyles()} ${isExiting ? 'animate-out fade-out slide-out-to-right-2 duration-300' : ''}`}
      role="alert"
    >
      {getIcon()}
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(id), 300);
        }}
        className="flex-shrink-0 mt-0.5 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Custom hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    message: string,
    type: ToastType = 'info',
    title?: string,
    duration?: number
  ) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      id,
      message,
      type,
      title,
      duration,
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, title?: string) => addToast(message, 'success', title);
  const error = (message: string, title?: string) => addToast(message, 'error', title || 'Error');
  const warning = (message: string, title?: string) => addToast(message, 'warning', title || 'Warning');
  const info = (message: string, title?: string) => addToast(message, 'info', title);
  const announcement = (message: string, title?: string) => addToast(message, 'announcement', title, 8000);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    announcement,
  };
};
