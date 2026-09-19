import React from 'react';
import { Badge } from './Badge';

interface SectionHeaderProps {
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  badgeVariant?: 'green' | 'gray' | 'purple';
  title: string;
  description?: string;
  className?: string;
}

// Reusable center-aligned section heading following the reference style
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  badgeIcon,
  badgeVariant = 'green',
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`text-center max-w-2xl mx-auto mb-12 sm:mb-16 ${className}`}>
      {badgeText && (
        <div className="mb-4 inline-flex justify-center">
          <Badge icon={badgeIcon} variant={badgeVariant}>
            {badgeText}
          </Badge>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
