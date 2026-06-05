import React from "react";
import { FiX } from "react-icons/fi";

interface Filters {
  dietaryTags?: string[];
  maxCookingTime?: number;
  maxCalories?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

interface ActiveFilterChipsProps {
  filters: Filters;
  onSetFilters: (partial: Partial<Filters>) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters, onSetFilters, onClearAll,
}) => (
  <div className="recs-active-filters">
    {(filters.dietaryTags || []).map((tag) => (
      <span key={tag} className="recs-chip">
        {tag}
        <button
          type="button"
          onClick={() =>
            onSetFilters({ dietaryTags: (filters.dietaryTags || []).filter((t) => t !== tag) })
          }
        >
          <FiX size={10} />
        </button>
      </span>
    ))}
    {filters.maxCookingTime && (
      <span className="recs-chip">
        ≤ {filters.maxCookingTime} mins
        <button type="button" onClick={() => onSetFilters({ maxCookingTime: undefined })}>
          <FiX size={10} />
        </button>
      </span>
    )}
    {filters.maxCalories && (
      <span className="recs-chip">
        ≤ {filters.maxCalories} kcal
        <button type="button" onClick={() => onSetFilters({ maxCalories: undefined })}>
          <FiX size={10} />
        </button>
      </span>
    )}
    {filters.difficulty && (
      <span className="recs-chip">
        {filters.difficulty}
        <button type="button" onClick={() => onSetFilters({ difficulty: undefined })}>
          <FiX size={10} />
        </button>
      </span>
    )}
    <button type="button" className="recs-chip recs-chip--clear" onClick={onClearAll}>
      Clear all
    </button>
  </div>
);
