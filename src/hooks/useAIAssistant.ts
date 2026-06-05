import { useCallback } from 'react';
import { useAssistantStore } from '@/store/assistantStore';
import { streamAIResponse } from '@/services/aiService';

export function useAIAssistant() {
  const {
    conversations,
    currentConversationId,
    isStreaming,
    recipeContext,
    getCurrentConversation,
    getMessages,
    newConversation,
    setCurrentConversation,
    addMessage,
    updateLastMessage,
    setStreaming,
    setRecipeContext,
    deleteConversation,
    clearAllConversations,
  } = useAssistantStore();

  const sendMessage = useCallback(
    async (content: string) => {
      let convId = currentConversationId;
      if (!convId) convId = newConversation();

      addMessage({ role: 'user', content });
      addMessage({ role: 'assistant', content: '', isStreaming: true });
      setStreaming(true);

      try {
        const messages = getMessages();
        const chatHistory = messages.slice(0, -1);

        let fullResponse = '';

        for await (const chunk of streamAIResponse(chatHistory, recipeContext || undefined)) {
          fullResponse += chunk;
          updateLastMessage(fullResponse);
        }

        updateLastMessage(fullResponse);
      } catch (error) {
        const errMsg =
          error instanceof Error
            ? `Sorry, I encountered an error: ${error.message}. Please try again.`
            : 'Sorry, something went wrong. Please try again.';
        updateLastMessage(errMsg);
      } finally {
        setStreaming(false);
      }
    },
    [
      currentConversationId,
      newConversation,
      addMessage,
      getMessages,
      updateLastMessage,
      setStreaming,
      recipeContext,
    ]
  );

  return {
    conversations,
    currentConversation: getCurrentConversation(),
    messages: getMessages(),
    isStreaming,
    recipeContext,
    sendMessage,
    newConversation,
    setCurrentConversation,
    setRecipeContext,
    deleteConversation,
    clearAllConversations,
  };
}
