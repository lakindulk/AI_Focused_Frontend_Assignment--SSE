import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Recipe } from "@/types";

interface CookingModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({ isOpen, onClose, recipe }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const total = recipe.instructions.length;

  const handleClose = () => {
    setStepIdx(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Cooking: ${recipe.title}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "14px", color: "var(--color-gray-500)", fontWeight: "bold", letterSpacing: "0.05em" }}>
          STEP {stepIdx + 1} OF {total}
        </div>

        <div style={{ width: "100%", height: "4px", background: "var(--color-gray-200)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              background: "var(--color-primary)",
              borderRadius: "var(--radius-full)",
              width: `${((stepIdx + 1) / total) * 100}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <div style={{ fontSize: "clamp(14px, 3.5vw, 18px)", fontFamily: "var(--font-body)", color: "var(--color-gray-900)", lineHeight: 1.7, minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
          {recipe.instructions[stepIdx]}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <Button
            variant="ghost"
            onClick={() => setStepIdx((p) => Math.max(0, p - 1))}
            disabled={stepIdx === 0}
          >
            Previous
          </Button>
          {stepIdx === total - 1 ? (
            <Button variant="primary" onClick={handleClose}>
              Finish! 🎉
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setStepIdx((p) => Math.min(total - 1, p + 1))}>
              Next Step
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
