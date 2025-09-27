import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Button } from './Button';

// size: sm | md | lg | xl | full
export function Modal({
  open,
  title,
  description,
  children,
  onClose,
  actions,
  size = 'lg',
  bodyClassName,
  fullHeight = false,
  hideFooter = false,
  initialFocusRef, // ref de un elemento dentro del modal que recibirá el foco inicial
  closeOnEsc = true,
  trapFocus = true,
}) {

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-3xl',
    full: 'max-w-5xl w-full mx-4',
  };

  const previouslyFocusedRef = useRef(null);
  const dialogRef = useRef(null);
  const descriptionId = description ? 'modal-desc' : undefined;

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (open) {
      previouslyFocusedRef.current = document.activeElement;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Enfocar elemento inicial
      requestAnimationFrame(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else if (dialogRef.current) {
          // Buscar primer elemento focusable
            const focusables = dialogRef.current.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusables.length) {
              focusables[0].focus();
            } else {
              dialogRef.current.focus();
            }
        }
      });

      return () => {
        document.body.style.overflow = originalOverflow;
        // Restaurar foco
        if (previouslyFocusedRef.current && previouslyFocusedRef.current.focus) {
          previouslyFocusedRef.current.focus();
        }
      };
    }
  }, [open, initialFocusRef]);

  // Escape para cerrar
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
      if (trapFocus && e.key === 'Tab' && dialogRef.current) {
        // Focus trap manual
        const focusables = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, [open, onClose, closeOnEsc, trapFocus]);

  if (!open) return null; // mover el return después de hooks para evitar advertencias

  return (
    <div className={clsx(
      'fixed inset-0 z-40 flex items-center justify-center p-4 animate-fade-in',
      fullHeight && 'items-stretch'
    )}>
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative z-50 w-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-card animate-slide-up-fade border border-gray-200 dark:border-gray-700',
          sizeClasses[size],
          fullHeight && 'h-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={descriptionId}
        ref={dialogRef}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-5 pb-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && (
                  <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descriptionId} className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Cerrar"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Body (scrollable) */}
        <div
          className={clsx(
            'px-6 py-5 overflow-y-auto',
            fullHeight ? 'flex-1' : 'max-h-[70vh]',
            bodyClassName
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {!hideFooter && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 bg-gray-50/60 dark:bg-gray-800/60 rounded-b-xl shrink-0">
            {actions || <Button variant="secondary" onClick={onClose}>Cerrar</Button>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
