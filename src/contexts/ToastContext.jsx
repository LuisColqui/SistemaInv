import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { ToastContext } from './toastContextCore';

let idCounter = 0;

const variants = {
  success: 'bg-green-600 text-white',
  error: 'bg-danger-600 text-white',
  info: 'bg-brand-600 text-white',
  warning: 'bg-warning-600 text-white',
};

function ToastProvider({ children, max = 5, duration = 5000 }) {
  const [toasts, setToasts] = useState([]);
  const queue = useRef([]);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(toast => toast.id !== id));
  }, []);

  const add = useCallback((toast) => {
    const id = ++idCounter;
    const item = { id, variant: 'info', ...toast };
    queue.current.push(item);

    setToasts(current => {
      const next = [...current, item].slice(-max);
      return next;
    });

    if (item.duration !== 0) {
      setTimeout(() => mounted.current && remove(id), item.duration || duration);
    }
    return id;
  }, [duration, max, remove]);

  const contextValue = { add, remove };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
}

export default ToastProvider;

function ToastViewport({ toasts, onDismiss }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 pointer-events-none flex flex-col items-end gap-2 p-4 sm:p-6 z-[200]">
      <div className="ml-auto w-full max-w-sm space-y-2">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
        ))}
      </div>
    </div>,
    document.body
  );
}

function ToastItem({ toast, onDismiss }) {
  return (
    <div
      role="status"
      className={clsx('pointer-events-auto rounded-md shadow-card animate-slide-up-fade border border-gray-200 dark:border-gray-700 overflow-hidden', variants[toast.variant])}
    >
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="flex-1">
          {toast.title && <p className="font-semibold text-sm leading-tight">{toast.title}</p>}
          {toast.description && <p className="text-xs mt-1 opacity-90 leading-snug">{toast.description}</p>}
        </div>
        <button
          onClick={onDismiss}
          className="text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded p-1"
          aria-label="Cerrar"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
