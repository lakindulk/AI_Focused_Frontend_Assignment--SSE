import React, { useState, useId } from 'react';
import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  isSearch?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  isSearch = false,
  className = '',
  id: idProp,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  type = 'text',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const generatedId = useId();
  const inputId = idProp ?? (label ? `input-${generatedId}` : undefined);
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  const hasValue = value !== undefined && value !== null && value.toString().length > 0;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const isActive = isFocused || hasValue;
  const resolvedIcon = isSearch ? <FiSearch /> : icon;

  const containerClasses = [
    'input-container',
    label ? 'input-container--has-label' : '',
    resolvedIcon ? 'input-container--has-prefix' : '',
    isActive ? 'input-container--active' : '',
    error ? 'input-container--error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="input-wrapper">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={label ? (isFocused ? placeholder : '') : placeholder}
          className={`input-field ${error ? 'input-field--error' : ''}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          {...props}
        />
        {resolvedIcon && <span className="input-icon-prefix" aria-hidden="true">{resolvedIcon}</span>}
        {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      </div>
      {error && (
        <span id={errorId} className="input-error-msg" role="alert">
          <FiAlertCircle aria-hidden="true" /> {error}
        </span>
      )}
    </div>
  );
};
