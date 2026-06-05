import React from "react";
import { FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

interface ContextBannerProps {
  recipeContext: string;
  onClear: () => void;
}

export const ContextBanner: React.FC<ContextBannerProps> = ({ recipeContext, onClear }) => (
  <div className="context-banner">
    <div className="context-banner__content">
      <HiSparkles className="context-banner__icon" />
      <span>
        Discussing: <strong>{recipeContext}</strong>
      </span>
    </div>
    <button
      type="button"
      className="context-banner__close"
      onClick={onClear}
      title="Clear recipe context"
      aria-label="Clear recipe context"
    >
      <FiX />
    </button>
  </div>
);
