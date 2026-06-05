import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '@/utils';
import type { ChatMessage, Conversation } from '@/types';

interface AssistantState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isStreaming: boolean;
  recipeContext: string | null;

  getCurrentConversation: () => Conversation | null;
  getMessages: () => ChatMessage[];
  newConversation: (title?: string) => string;
  setCurrentConversation: (id: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateLastMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  setRecipeContext: (context: string | null) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isStreaming: false,
      recipeContext: null,

      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        return conversations.find((c) => c.id === currentConversationId) || null;
      },

      getMessages: () => {
        const conv = get().getCurrentConversation();
        return conv?.messages || [];
      },

      newConversation: (title?: string) => {
        const id = uid();
        const conversation: Conversation = {
          id,
          title: title || 'New Conversation',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversationId: id,
        }));

        return id;
      },

      setCurrentConversation: (id) => set({ currentConversationId: id }),

      addMessage: (message) => {
        const { currentConversationId, conversations } = get();
        if (!currentConversationId) return;
        const newMessage: ChatMessage = { ...message, id: uid(), timestamp: Date.now() };
        set({
          conversations: conversations.map((conv) =>
            conv.id === currentConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  updatedAt: Date.now(),
                  title:
                    conv.messages.length === 0 && message.role === 'user'
                      ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                      : conv.title,
                }
              : conv
          ),
        });
      },

      updateLastMessage: (content) => {
        const { currentConversationId, conversations } = get();
        if (!currentConversationId) return;

        set({
          conversations: conversations.map((conv) =>
            conv.id === currentConversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg, i) =>
                    i === conv.messages.length - 1
                      ? { ...msg, content, isStreaming: false }
                      : msg
                  ),
                  updatedAt: Date.now(),
                }
              : conv
          ),
        });
      },

      setStreaming: (streaming) => set({ isStreaming: streaming }),

      setRecipeContext: (context) => set({ recipeContext: context }),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversationId:
            state.currentConversationId === id ? null : state.currentConversationId,
        })),

      clearAllConversations: () =>
        set({ conversations: [], currentConversationId: null }),
    }),
    {
      name: 'chef-ai-assistant',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
      }),
    }
  )
);
