import React from 'react';
import clsx from 'clsx';

export function Label({ htmlFor, children, className, required }) {
  return (
    <label htmlFor={htmlFor} className={clsx('block text-sm font-medium text-gray-700 dark:text-gray-300', className)}>
      {children}{required && <span className="text-danger-500 ml-0.5">*</span>}
    </label>
  );
}

export const inputBase = 'block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-brand-500 focus:ring-brand-500 text-sm placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed';

export function Input({ className, ...props }) {
  return <input className={clsx(inputBase, className)} {...props} />;
}

export function Textarea({ className, rows = 4, ...props }) {
  return <textarea rows={rows} className={clsx(inputBase, 'resize-none', className)} {...props} />;
}

export function HelperText({ children, state }) {
  if (!children) return null;
  return (
    <p className={clsx('mt-1 text-xs',
      state === 'error' && 'text-danger-600',
      state === 'success' && 'text-accent-600',
      !state && 'text-gray-500 dark:text-gray-400'
    )}>{children}</p>
  );
}

export function Field({ children, className }) {
  return <div className={clsx('space-y-1.5', className)}>{children}</div>;
}

export default Input;
