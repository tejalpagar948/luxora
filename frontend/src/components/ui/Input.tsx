import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full font-body">
        {label && (
          <label className="block text-label-caps mb-2 text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border border-border-light rounded-md bg-background text-primary placeholder-neutral-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all duration-200 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
