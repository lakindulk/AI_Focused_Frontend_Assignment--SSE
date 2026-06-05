import React, { useState, useEffect } from 'react';

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
  speed?: number;
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  isStreaming = false,
  speed = 15,
}) => {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    if (isStreaming) {
      setDisplayedText(text);
      return;
    }

    if (displayedText.length < text.length) {
      const interval = setInterval(() => {
        setDisplayedText((prev) => {
          if (prev.length >= text.length) {
            clearInterval(interval);
            return text;
          }
          return text.slice(0, prev.length + 1);
        });
      }, speed);

      return () => clearInterval(interval);
    } else {
      setDisplayedText(text);
    }
  }, [text, isStreaming, speed]);

  return (
    <span style={{ position: 'relative' }}>
      {displayedText}
      {isStreaming && (
        <span
          className="streaming-cursor"
          style={{
            display: 'inline-block',
            width: '8px',
            height: '15px',
            backgroundColor: 'var(--color-primary)',
            marginLeft: '4px',
            verticalAlign: 'middle',
            animation: 'pulse 1s infinite',
          }}
        />
      )}
    </span>
  );
};
export default StreamingText;
