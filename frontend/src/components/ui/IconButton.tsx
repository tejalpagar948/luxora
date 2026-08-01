import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`p-2 rounded-full hover:bg-secondary text-primary transition-colors duration-200 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
