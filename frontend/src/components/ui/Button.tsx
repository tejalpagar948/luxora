import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'font-body text-button px-6 py-3 rounded-md transition-all duration-300 focus:outline-none uppercase font-semibold text-center inline-block cursor-pointer';
  
  const variants = {
    primary: 'bg-primary text-background hover:bg-neutral-800 border border-primary',
    secondary: 'bg-secondary text-primary hover:bg-neutral-200 border border-secondary',
    accent: 'bg-accent text-background hover:bg-amber-600 border border-accent',
    outline: 'bg-transparent text-primary hover:bg-primary hover:text-background border border-primary',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
