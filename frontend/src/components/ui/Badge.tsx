import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const baseStyle = 'font-body text-[10px] tracking-widest font-semibold uppercase px-2.5 py-1 rounded-md inline-block';
  
  const variants = {
    primary: 'bg-primary text-background',
    secondary: 'bg-secondary text-primary',
    accent: 'bg-accent text-background',
    outline: 'bg-transparent text-primary border border-primary',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
