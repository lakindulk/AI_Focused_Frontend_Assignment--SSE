import React from "react";
import { FiRefreshCw, FiX } from "react-icons/fi";
import { TagSelector } from "@/components/ui/TagSelector";
import { Button } from "@/components/ui/Button";
import { dietaryOptions } from "@/services/mockData";

interface Filters {
  dietaryTags?: string[];
  maxCookingTime?: number;
  maxCalories?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

interface RecommendationsFilterProps {
  isOpen: boolean;
  filters: Filters;
  isLoading: boolean;
  onClose: () => void;
  onDietTagsChange: (tags: string[]) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCaloriesChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDifficultyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
  onApply: () => void;
}

export const RecommendationsFilter: React.FC<RecommendationsFilterProps> = ({
  isOpen, filters, isLoading, onClose, onDietTagsChange,
  onTimeChange, onCaloriesChange, onDifficultyChange, onReset, onApply,
}) => (
  <div className={`recs-filters ${isOpen ? "recs-filters--open" : ""}`}>
    <div className="recs-filters__header">
      <span className="recs-filters__header-title">Refine Results</span>
      <button type="button" className="recs-filters__close" onClick={onClose}>
        <FiX />
      </button>
    </div>

    <div className="recs-filters__body">
      <div className="recs-filters__row recs-filters__row--tags">
        <div className="recs-filters__group recs-filters__group--wide">
          <TagSelector
            label="Dietary Preferences"
            options={dietaryOptions}
            selected={filters.dietaryTags || []}
            onChange={onDietTagsChange}
          />
        </div>
      </div>

      <div className="recs-filters__row">
        <div className="recs-filters__group">
          <label className="recs-filters__label">Cooking Time</label>
          <select className="recs-filters__select" value={filters.maxCookingTime || ""} onChange={onTimeChange}>
            <option value="">Any Time</option>
            <option value="15">Under 15 mins</option>
            <option value="30">Under 30 mins</option>
            <option value="45">Under 45 mins</option>
            <option value="60">Under 60 mins</option>
          </select>
        </div>

        <div className="recs-filters__group">
          <label className="recs-filters__label">Calories</label>
          <select className="recs-filters__select" value={filters.maxCalories || ""} onChange={onCaloriesChange}>
            <option value="">Any Calories</option>
            <option value="400">Under 400 kcal</option>
            <option value="600">Under 600 kcal</option>
            <option value="800">Under 800 kcal</option>
          </select>
        </div>

        <div className="recs-filters__group">
          <label className="recs-filters__label">Difficulty</label>
          <select className="recs-filters__select" value={filters.difficulty || ""} onChange={onDifficultyChange}>
            <option value="">Any Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="recs-filters__btn-row">
          <Button variant="ghost" size="sm" icon={<FiRefreshCw />} onClick={onReset}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={onApply} isLoading={isLoading}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  </div>
);
