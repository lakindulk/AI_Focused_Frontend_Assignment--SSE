import React from 'react';
import { GiChefToque } from 'react-icons/gi';
import type { ChatMessage } from '@/types';
import './ChatBubble.css';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;

    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1<\/ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    html = html.split('\n').map((line) => {
      if (
        line.trim().startsWith('<li') || line.trim().startsWith('<ul') ||
        line.trim().startsWith('</ul') || line.trim().startsWith('<pre') ||
        line.trim().startsWith('</pre') || line.trim().startsWith('<code') ||
        line.trim().startsWith('</code')
      ) {
        return line;
      }
      return `${line}<br/>`;
    }).join('\n');

    return (
      <div
        className="chat-bubble__markdown"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div
      className={`chat-bubble-container ${isUser ? 'chat-bubble-container--user' : 'chat-bubble-container--assistant'}`}
      role="listitem"
    >
      {!isUser && (
        <div className="chat-bubble__avatar" aria-hidden="true">
          <GiChefToque />
        </div>
      )}
      <div className={`chat-bubble ${isUser ? 'chat-bubble--user' : 'chat-bubble--assistant'}`}>
        {renderMarkdown(message.content)}
        {/* Blinking cursor while streaming */}
        {!isUser && message.isStreaming && (
          <span className="chat-bubble__cursor" aria-hidden="true" />
        )}
        <span className="chat-bubble__time">
          <time dateTime={new Date(message.timestamp).toISOString()}>
            {formatTime(message.timestamp)}
          </time>
          {!isUser && message.isStreaming && (
            <span className="sr-only"> — generating</span>
          )}
        </span>
      </div>
    </div>
  );
};
