import React from 'react';
import './Badge.css';

interface BadgeProps {
  variant: 'easy' | 'medium' | 'hard' | 'diet' | 'calorie' | 'time' | 'ai-match';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  icon,
  children,
  className = '',
}) => {
  const badgeClasses = [
    'badge',
    `badge--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses}>
      {icon && <span className="badge__icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
