import React, { useRef, useState, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'ai-action';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  children,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading || variant === 'ghost') return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
  };

  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);
    return () => clearTimeout(timer);
  }, [ripples]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleRipple(e);
    if (onClick) {
      onClick(e);
    }
  };

  const btnClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled ? 'btn--disabled' : '',
    isLoading ? 'btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={buttonRef}
      type={type}
      className={btnClasses}
      disabled={disabled || isLoading}
      onClick={handleClick}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="btn__spinner-wrapper">
          <FiLoader className="btn__spinner" />
        </span>
      )}
      <span className={`btn__content ${isLoading ? 'btn__content--hidden' : ''}`}>
        {icon && <span className="btn__icon">{icon}</span>}
        {children}
      </span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="btn__ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </button>
  );
};
