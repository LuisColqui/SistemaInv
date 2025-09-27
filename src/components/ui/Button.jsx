import React from 'react';
import clsx from 'clsx';

/**
 * Button component
 * Variants: primary | secondary | outline | danger | ghost
 * Sizes: sm | md | lg
 */
const baseStyles = 'inline-flex items-center justify-center font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md';

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white focus-visible:ring-brand-500',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus-visible:ring-brand-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
  outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-brand-500',
  danger: 'bg-danger-600 hover:bg-danger-700 text-white focus-visible:ring-danger-500',
  ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus-visible:ring-brand-500',
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  loading = false,
  ...props
}) {
  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className, loading && 'relative')}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </span>
      )}
      <span className={clsx('inline-flex items-center gap-2', loading && 'opacity-0')}> 
        {LeadingIcon && <LeadingIcon className="h-4 w-4" />}
        {children}
        {TrailingIcon && <TrailingIcon className="h-4 w-4" />}
      </span>
    </button>
  );
}

export default Button;
