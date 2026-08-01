import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <section className={`border-b border-border-light pb-8 mb-8 font-body ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Title and description */}
        <div className="lg:col-span-1">
          <h3 className="font-display text-[20px] font-semibold text-primary mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-neutral-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Form fields content */}
        <div className="lg:col-span-2 space-y-6">
          {children}
        </div>
      </div>
    </section>
  );
};
