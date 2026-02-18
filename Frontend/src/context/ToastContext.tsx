import React, { createContext, useContext, ReactNode } from 'react';
import { useToast as useToastHook, Toast, ToastType, ToastContainer } from '../components/ui/Toast';

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, title?: string, duration?: number) => string;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
  announcement: (message: string, title?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToastHook();

  return (
    <ToastContext.Provider
      value={{
        toasts: toast.toasts,
        addToast: toast.addToast,
        removeToast: toast.removeToast,
        success: toast.success,
        error: toast.error,
        warning: toast.warning,
        info: toast.info,
        announcement: toast.announcement,
      }}
    >
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};
