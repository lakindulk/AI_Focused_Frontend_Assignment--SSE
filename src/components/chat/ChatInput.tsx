import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import './ChatInput.css';

interface ChatInputProps {
  onSend: (message: string) => void;
  isDisabled?: boolean;
  suggestions?: string[];
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isDisabled = false,
  suggestions = [],
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(100, textarea.scrollHeight)}px`;
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || isDisabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-area">
      {suggestions.length > 0 && (
        <div className="chat-suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="chat-suggestion-chip"
              onClick={() => onSend(suggestion)}
              disabled={isDisabled}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask CookIT anything (e.g., 'What can I substitute for garlic?')..."
          className="chat-input-textarea"
          rows={1}
          disabled={isDisabled}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || isDisabled}
          className="chat-input-send-btn"
          aria-label="Send message"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};
