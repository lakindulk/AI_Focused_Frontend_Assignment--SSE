import React, { useRef, useEffect } from 'react';
import { FiSquare } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage } from '@/types';
import './ChatWindow.css';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isStreaming?: boolean;
  onStop?: () => void;
  suggestions?: string[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSend,
  isStreaming = false,
  onStop,
  suggestions = [],
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    <div className="chat-window">
      {/* aria-live="polite" announces new messages to screen readers */}
      <div
        className="chat-window__messages"
        role="list"
        aria-label="Conversation messages"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <div className="chat-window__empty-state" role="status">
            <div className="chat-window__empty-icon" aria-hidden="true">
              <HiSparkles />
            </div>
            <h3 className="chat-window__empty-title">Meet CookIT Copilot</h3>
            <p className="chat-window__empty-desc">
              Ask about ingredients you have in the fridge, substitute tips, nutritional facts, or step-by-step guidance!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))
        )}

        {isStreaming && <TypingIndicator />}
        <div ref={messageEndRef} aria-hidden="true" />
      </div>

      {/* Stop-generation button — visible only while streaming */}
      {isStreaming && onStop && (
        <div className="chat-window__stop-row">
          <button
            type="button"
            className="chat-window__stop-btn"
            onClick={onStop}
            aria-label="Stop generating response"
          >
            <FiSquare aria-hidden="true" />
            Stop generating
          </button>
        </div>
      )}

      <div className="chat-window__footer">
        <ChatInput
          onSend={onSend}
          isDisabled={isStreaming}
          suggestions={suggestions}
        />
      </div>
    </div>
  );
};
export default ChatWindow;
