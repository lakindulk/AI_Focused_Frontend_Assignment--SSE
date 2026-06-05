import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { Button } from './Button';
import './ErrorState.css';

interface ErrorStateProps {
  message: string;
  title?: string;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  onSecondary?: () => void;
  secondaryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  title,
  icon,
  onRetry,
  retryLabel = 'Retry',
  onSecondary,
  secondaryLabel,
  className = '',
}) => (
  <div className={`error-state ${className}`}>
    <div className="error-state__icon">
      {icon ?? <FiAlertCircle />}
    </div>
    {title && <h3 className="error-state__title">{title}</h3>}
    <p className="error-state__message">{message}</p>
    {(onRetry || onSecondary) && (
      <div className="error-state__actions">
        {onRetry && (
          <Button variant="primary" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
        {onSecondary && secondaryLabel && (
          <Button variant="ghost" size="sm" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
      </div>
    )}
  </div>
);
