import React from "react";
import { FiCpu, FiRefreshCw, FiZap } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { TOKEN_LIMITS } from "@/services/aiService";

const QUICK_PRESETS = [
  { label: "High Protein", query: "High protein, 2200 calories target, muscle building" },
  { label: "Weight Loss",  query: "Low calorie, 1500 calories, weight loss, high fibre" },
  { label: "Vegetarian",   query: "Vegetarian, balanced macros, varied cuisines" },
  { label: "Keto",         query: "Keto, low carb under 50g, high fat, no grains" },
];

interface MealPlanFormProps {
  preferences: string;
  isGenerating: boolean;
  onPreferencesChange: (val: string) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  onPresetSelect: (query: string) => void;
}

export const MealPlanForm: React.FC<MealPlanFormProps> = ({
  preferences, isGenerating, onPreferencesChange, onSubmit, onPresetSelect,
}) => (
  <div className="planner-panel">
    <div className="planner-panel__top">
      <div className="planner-panel__icon-wrap">
        <FiCpu />
      </div>
      <div className="planner-panel__info">
        <span className="planner-panel__info-title">Describe Your Goals</span>
        <span className="planner-panel__info-sub">
          Token budget: {TOKEN_LIMITS.mealPlan} tokens · AI will generate 21 meals
        </span>
      </div>
    </div>

    <form onSubmit={onSubmit} className="planner-panel__form">
      <div className="planner-panel__presets">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="planner-preset-btn"
            onClick={() => onPresetSelect(preset.query)}
            disabled={isGenerating}
          >
            <FiZap size={12} />
            {preset.label}
          </button>
        ))}
      </div>

      <div className="planner-panel__row">
        <div className="planner-panel__input-group">
          <input
            className="planner-panel__input"
            placeholder="E.g. 'Low carb high protein, 1800 calories, dairy free'…"
            value={preferences}
            onChange={(e) => onPreferencesChange(e.target.value)}
            disabled={isGenerating}
          />
        </div>
        <Button type="submit" variant="primary" isLoading={isGenerating} icon={<FiRefreshCw />}>
          Generate Plan
        </Button>
      </div>
    </form>
  </div>
);
