import React, { useEffect, useRef, useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { RecipeGrid } from '@/components/recipe/RecipeGrid';
import { ErrorState } from '@/components/ui/ErrorState';
import { RecommendationsHeader } from '@/components/recommendations/RecommendationsHeader';
import { RecommendationsFilter } from '@/components/recommendations/RecommendationsFilter';
import { ActiveFilterChips } from '@/components/recommendations/ActiveFilterChips';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';
import { useSearchStore } from '@/store/searchStore';
import { RECS_CACHE_KEY } from '@/constants';
import './Recommendations.css';

export const Recommendations: React.FC = () => {
  const {
    filters, results, isLoading, isError, error,
    setFilters, search, clearResults, refetch,
  } = useRecipeSearch();

  const { query, storeResults } = useSearchStore();
  const [showFilters, setShowFilters] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const pendingSave = useRef(false);

  const readCache = () => {
    try {
      const raw = localStorage.getItem(RECS_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.results) && parsed.results.length > 0 ? parsed.results : null;
    } catch { return null; }
  };

  const writeCache = (recs: typeof results) => {
    try {
      localStorage.setItem(RECS_CACHE_KEY, JSON.stringify({ results: recs, timestamp: Date.now() }));
    } catch {}
  };

  useEffect(() => {
    const cached = readCache();
    if (cached) { storeResults(cached); setIsCached(true); }
    else if (results.length === 0 && !isLoading) { pendingSave.current = true; search(); }
  }, []);

  useEffect(() => {
    if (!isLoading && results.length > 0 && pendingSave.current) {
      writeCache(results);
      pendingSave.current = false;
      setIsCached(true);
    }
  }, [results, isLoading]);

  const handleRefresh = () => { pendingSave.current = true; setIsCached(false); search(); };
  const handleReset = () => { clearResults(); setTimeout(() => search(), 50); };

  const hasActiveFilters =
    (filters.dietaryTags?.length ?? 0) > 0 ||
    !!filters.maxCookingTime || !!filters.maxCalories || !!filters.difficulty;

  return (
    <PageWrapper className="recs-page">
      <RecommendationsHeader
        query={query}
        resultCount={results.length}
        isCached={isCached}
        isLoading={isLoading}
        showFilters={showFilters}
        hasActiveFilters={hasActiveFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onRefresh={handleRefresh}
      />

      <RecommendationsFilter
        isOpen={showFilters}
        filters={filters}
        isLoading={isLoading}
        onClose={() => setShowFilters(false)}
        onDietTagsChange={(tags) => setFilters({ dietaryTags: tags })}
        onTimeChange={(e) => setFilters({ maxCookingTime: e.target.value ? parseInt(e.target.value) : undefined })}
        onCaloriesChange={(e) => setFilters({ maxCalories: e.target.value ? parseInt(e.target.value) : undefined })}
        onDifficultyChange={(e) => setFilters({ difficulty: e.target.value ? (e.target.value as 'Easy' | 'Medium' | 'Hard') : undefined })}
        onReset={handleReset}
        onApply={() => { search(); setShowFilters(false); }}
      />

      {hasActiveFilters && (
        <ActiveFilterChips
          filters={filters}
          onSetFilters={setFilters}
          onClearAll={handleReset}
        />
      )}

      {isError && (
        <ErrorState
          message={error || 'Failed to load recipes. Please check your AI configuration.'}
          onRetry={refetch}
        />
      )}

      {!isError && (
        <RecipeGrid
          recipes={results}
          isLoading={isLoading}
          emptyActionLabel="Reset & Search Again"
          onEmptyAction={handleReset}
        />
      )}
    </PageWrapper>
  );
};

export default Recommendations;
