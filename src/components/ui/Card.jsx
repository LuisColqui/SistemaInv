import React from 'react';
import clsx from 'clsx';

export function Card({ children, className }) {
  return (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow-card hover:shadow-card-hover transition-shadow border border-gray-200/70 dark:border-gray-700/60', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, icon: Icon, actions, className }) {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4', className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="h-10 w-10 rounded-md bg-brand-50 dark:bg-brand-600/20 text-brand-600 dark:text-brand-300 flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={clsx('px-6 py-5 text-sm text-gray-700 dark:text-gray-200', className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return <div className={clsx('px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3', className)}>{children}</div>;
}

export default Card;
