import React from 'react';
import './TagSelector.css';

interface TagSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  className?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  options,
  selected,
  onChange,
  label,
  className = '',
}) => {
  const handleToggle = (option: string) => {
    const isSelected = selected.includes(option);
    const newSelected = isSelected
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className={`tag-selector ${className}`}>
      {label && <span className="tag-selector__label">{label}</span>}
      <div className="tag-selector__container">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`tag-chip ${isSelected ? 'tag-chip--selected' : ''}`}
              onClick={() => handleToggle(option)}
              aria-pressed={isSelected}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};
