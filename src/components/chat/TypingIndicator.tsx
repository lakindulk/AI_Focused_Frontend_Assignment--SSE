import React from 'react';
import { GiChefToque } from 'react-icons/gi';
import './TypingIndicator.css';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator-container">
      <div className="chat-bubble__avatar">
        <GiChefToque />
      </div>
      <div className="typing-bubble">
        <div className="typing-dots">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
        <span className="typing-text">CookIT is thinking...</span>
      </div>
    </div>
  );
};
