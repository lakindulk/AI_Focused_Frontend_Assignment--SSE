import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'title' | 'image' | 'card' | 'circle';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}) => {
  const styles: React.CSSProperties = {
    width,
    height,
  };

  if (variant === 'card') {
    return (
      <div className={`skeleton-card ${className}`}>
        <div className="skeleton-base skeleton-card__image" />
        <div className="skeleton-card__body">
          <div className="skeleton-card__badge-row">
            <div className="skeleton-base skeleton-card__badge" />
            <div className="skeleton-base skeleton-card__badge" />
            <div className="skeleton-base skeleton-card__badge" />
          </div>
          <div className="skeleton-base skeleton--title" style={{ width: '80%' }} />
          <div className="skeleton-base skeleton--text" style={{ width: '95%' }} />
          <div className="skeleton-base skeleton--text" style={{ width: '40%' }} />
        </div>
      </div>
    );
  }

  const renderSkeletonItem = (index: number) => {
    const itemClasses = [
      'skeleton-base',
      `skeleton--${variant}`,
      className,
    ].filter(Boolean).join(' ');

    return <div key={index} className={itemClasses} style={styles} />;
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => renderSkeletonItem(i))}
    </>
  );
};
