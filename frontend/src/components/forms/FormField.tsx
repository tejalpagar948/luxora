import React from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`mb-6 font-body ${className}`}>
      {label && (
        <label className="block text-label-caps mb-2 text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {children}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
};
