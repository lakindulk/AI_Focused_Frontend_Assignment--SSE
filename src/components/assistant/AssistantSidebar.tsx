import React from "react";
import { FiPlus, FiTrash2, FiMessageSquare, FiZap } from "react-icons/fi";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { TOKEN_LIMITS } from "@/services/aiService";

interface Conversation {
  id: string;
  title: string;
}

interface AssistantSidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  currentConversationId: string | null;
  isApiKeyConfigured: boolean;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteChat: (e: React.MouseEvent, id: string) => void;
}

export const AssistantSidebar: React.FC<AssistantSidebarProps> = ({
  isOpen, conversations, currentConversationId, isApiKeyConfigured,
  onNewChat, onSelectConversation, onDeleteChat,
}) => (
  <aside
    id="assistant-sidebar"
    className={`assistant-sidebar ${isOpen ? "assistant-sidebar--open" : ""}`}
    aria-label="Conversation history"
  >
    <div className="assistant-sidebar__header">
      <div className="assistant-sidebar__logo">
        <MdOutlineAutoAwesome />
        <span>CookIT</span>
      </div>
      <button
        type="button"
        className="assistant-sidebar__new-btn"
        onClick={onNewChat}
        title="New chat"
      >
        <FiPlus />
      </button>
    </div>

    <div className="assistant-sidebar__section-label">Conversations</div>

    <div className="assistant-sidebar__list">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          type="button"
          className={`session-item ${conv.id === currentConversationId ? "session-item--active" : ""}`}
          onClick={() => onSelectConversation(conv.id)}
        >
          <FiMessageSquare className="session-item__icon" />
          <span className="session-item__title">{conv.title}</span>
          {conversations.length > 1 && (
            <button
              type="button"
              className="session-item__delete"
              onClick={(e) => onDeleteChat(e, conv.id)}
              title="Delete chat"
              aria-label="Delete chat"
            >
              <FiTrash2 size={12} />
            </button>
          )}
        </button>
      ))}
    </div>

    <div className="assistant-sidebar__footer">
      <div className="token-info">
        <div className="token-info__row">
          <FiZap className="token-info__icon" />
          <span className="token-info__label">Token Budget</span>
        </div>
        <div className="token-info__bars">
          <div className="token-info__bar-row">
            <span className="token-info__bar-label">Per message</span>
            <div className="token-info__bar-track">
              <div
                className="token-info__bar-fill"
                style={{ width: `${(TOKEN_LIMITS.streaming / 1000) * 100}%` }}
              />
            </div>
            <span className="token-info__bar-value">{TOKEN_LIMITS.streaming}</span>
          </div>
        </div>
        <div className="token-info__mode">
          <span className={`token-info__dot ${isApiKeyConfigured ? "token-info__dot--live" : ""}`} />
          {isApiKeyConfigured ? "Live AI" : "Demo Mode"}
        </div>
      </div>
    </div>
  </aside>
);
