import React from "react";
import { FiFilter, FiRefreshCw } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";

interface RecommendationsHeaderProps {
  query: string;
  resultCount: number;
  isCached: boolean;
  isLoading: boolean;
  showFilters: boolean;
  hasActiveFilters: boolean;
  onToggleFilters: () => void;
  onRefresh: () => void;
}

export const RecommendationsHeader: React.FC<RecommendationsHeaderProps> = ({
  query, resultCount, isCached, isLoading, showFilters, hasActiveFilters,
  onToggleFilters, onRefresh,
}) => (
  <div className="recs-header">
    <div className="recs-header__left">
      <div className="recs-header__eyebrow">
        <HiSparkles />
        AI-Powered Results
      </div>
      <h1 className="recs-header__title">
        {query ? `Results for "${query}"` : "AI Recipe Recommendations"}
      </h1>
      <p className="recs-header__desc">
        {isCached && resultCount > 0 ? (
          <>
            <span className="recs-cached-badge">
              <FiRefreshCw size={10} /> Cached
            </span>
            {resultCount} recipe{resultCount !== 1 ? "s" : ""} — hit Refresh for a new AI set
          </>
        ) : resultCount > 0 ? (
          `${resultCount} recipe${resultCount !== 1 ? "s" : ""} matched your request`
        ) : (
          "Personalised using AI to match your preferences and ingredients."
        )}
      </p>
    </div>
    <div className="recs-header__actions">
      <button
        type="button"
        className={`recs-filter-toggle ${showFilters ? "recs-filter-toggle--active" : ""} ${hasActiveFilters ? "recs-filter-toggle--has-filters" : ""}`}
        onClick={onToggleFilters}
      >
        <FiFilter />
        Filters
        {hasActiveFilters && <span className="recs-filter-badge" />}
      </button>
      <Button
        variant="primary"
        size="sm"
        icon={<FiRefreshCw className={isLoading ? "spin" : ""} />}
        onClick={onRefresh}
        isLoading={isLoading}
      >
        Refresh
      </Button>
    </div>
  </div>
);
