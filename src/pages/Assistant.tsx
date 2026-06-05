import React, { useState, useEffect, useRef } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { HiMenuAlt2 } from 'react-icons/hi';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { AssistantSidebar } from '@/components/assistant/AssistantSidebar';
import { ContextBanner } from '@/components/assistant/ContextBanner';
import { useAssistantStore } from '@/store/assistantStore';
import { streamAIResponse } from '@/services/aiService';
import type { ChatMessage } from '@/types';
import './Assistant.css';

const isApiKeyConfigured = !!import.meta.env.VITE_AI_API_KEY;

const SUGGESTIONS = [
  'What can I cook with chicken, spinach and cream?',
  'How do I substitute buttermilk in a recipe?',
  'Suggest a high-protein vegetarian meal plan',
  'What does sauté mean?',
  'How can I make this recipe spicier?',
  'Give me a 30-minute easy dinner idea',
];

export const Assistant: React.FC = () => {
  const {
    conversations, currentConversationId, recipeContext, isStreaming,
    newConversation, setCurrentConversation, addMessage, updateLastMessage,
    setStreaming, setRecipeContext, deleteConversation, getMessages,
  } = useAssistantStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messages = getMessages();

  useEffect(() => {
    if (conversations.length === 0) newConversation('New Conversation');
    else if (!currentConversationId) setCurrentConversation(conversations[0].id);
  }, [conversations, currentConversationId]);

  const handleSendMessage = async (text: string) => {
    if (!currentConversationId) return;
    setFailedMessage(null);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    addMessage({ role: 'user' as const, content: text });
    setStreaming(true);
    addMessage({ role: 'assistant' as const, content: '', isStreaming: true });
    try {
      const updatedMessages: ChatMessage[] = [
        ...messages,
        { id: 'user-temp', role: 'user' as const, content: text, timestamp: Date.now() },
      ];
      const generator = streamAIResponse(updatedMessages, recipeContext || undefined, controller.signal);
      let accumulated = '';
      for await (const chunk of generator) {
        if (controller.signal.aborted) break;
        accumulated += chunk;
        updateLastMessage(accumulated);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('Stream error:', err);
      updateLastMessage('Sorry, something went wrong while generating a response.');
      setFailedMessage(text);
    } finally {
      setStreaming(false);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const handleRetry = () => {
    if (!failedMessage) return;
    const msg = failedMessage;
    setFailedMessage(null);
    handleSendMessage(msg);
  };

  const handleNewChat = () => {
    const id = newConversation('New Conversation');
    setCurrentConversation(id);
    setFailedMessage(null);
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id);
    setFailedMessage(null);
    setIsSidebarOpen(false);
  };

  return (
    <PageWrapper className="assistant-page" style={{ flexDirection: 'row' }}>
      <button
        type="button"
        className="sidebar-toggle-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle conversation history"
        aria-expanded={isSidebarOpen}
        aria-controls="assistant-sidebar"
      >
        <HiMenuAlt2 />
      </button>

      {isSidebarOpen && (
        <div
          className="assistant-sidebar__overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <AssistantSidebar
        isOpen={isSidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        isApiKeyConfigured={isApiKeyConfigured}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteChat={handleDeleteChat}
      />

      <div className="assistant-chat-container">
        {recipeContext && (
          <ContextBanner recipeContext={recipeContext} onClear={() => setRecipeContext(null)} />
        )}

        {failedMessage && !isStreaming && (
          <div className="assistant-retry-banner" role="alert">
            <span className="assistant-retry-banner__text">
              Message failed to send — check your API configuration.
            </span>
            <button
              type="button"
              className="assistant-retry-banner__btn"
              onClick={handleRetry}
            >
              <FiRefreshCw /> Retry
            </button>
            <button
              type="button"
              className="assistant-retry-banner__dismiss"
              onClick={() => setFailedMessage(null)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <ChatWindow
          messages={messages}
          onSend={handleSendMessage}
          isStreaming={isStreaming}
          onStop={handleStop}
          suggestions={SUGGESTIONS}
        />
      </div>
    </PageWrapper>
  );
};

export default Assistant;
