import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'green' | 'gray' | 'purple';
  className?: string;
}

// Small pill badge matching the reference screenshots (e.g. ⚡ Simple Process, 📊 Daily AI Analysis)
export const Badge: React.FC<BadgeProps> = ({
  children,
  icon,
  variant = 'green',
  className = '',
}) => {
  const variantStyles = {
    green: 'bg-[#e8faf1] text-[#008f4c] border border-[#b7eed4]',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {children}
    </span>
  );
};
