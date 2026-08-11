import React from 'react';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`font-body text-label-caps px-4 py-1.5 rounded-full border transition-all duration-300 uppercase ${active
          ? 'bg-primary text-background border-primary'
          : 'bg-transparent text-primary border-border-light hover:border-primary'
        } ${className}`}
    >
      {label}
    </button>
  );
};
