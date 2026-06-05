import React from "react";
import { FiHeart, FiMessageSquare, FiPlay } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

interface RecipeStickyBarProps {
  isFav: boolean;
  onToggleFav: () => void;
  onAskAI: () => void;
  onStartCooking: () => void;
}

export const RecipeStickyBar: React.FC<RecipeStickyBarProps> = ({
  isFav, onToggleFav, onAskAI, onStartCooking,
}) => (
  <div className="sticky-bottom-bar">
    <div className="sticky-bottom-bar__container">
      <Button
        variant="ghost"
        icon={
          <FiHeart
            fill={isFav ? "var(--color-error)" : "transparent"}
            style={{ color: isFav ? "var(--color-error)" : "inherit" }}
          />
        }
        onClick={onToggleFav}
      >
        {isFav ? "Saved" : "Save"}
      </Button>

      <div className="sticky-bottom-bar__buttons">
        <Button variant="secondary" icon={<FiMessageSquare />} onClick={onAskAI}>
          Ask AI
        </Button>
        <Button variant="primary" icon={<FiPlay />} onClick={onStartCooking}>
          Start Cooking
        </Button>
      </div>
    </div>
  </div>
);
