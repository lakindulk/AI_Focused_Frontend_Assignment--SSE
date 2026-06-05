import React from 'react';
import './SuggestedPrompts.css';

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
  title?: string;
  className?: string;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  prompts,
  onPromptClick,
  title = 'Suggested Topics',
  className = '',
}) => {
  if (prompts.length === 0) return null;

  return (
    <div className={`suggested-prompts-container ${className}`}>
      {title && <span className="suggested-prompts__title">{title}</span>}
      <div className="suggested-prompts__chips">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="suggested-prompts__chip"
            onClick={() => onPromptClick(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
export default SuggestedPrompts;
