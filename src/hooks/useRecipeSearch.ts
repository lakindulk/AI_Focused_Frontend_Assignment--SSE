import { useCallback } from 'react';
import { useSearchStore } from '@/store/searchStore';

export function useRecipeSearch() {
  const {
    query,
    filters,
    results,
    isSearching,
    error,
    hasSearched,
    setQuery,
    setFilters,
    search,
    searchWithQuery,
    clearResults,
  } = useSearchStore();

  const refetch = useCallback(() => {
    search();
  }, [search]);

  return {
    query,
    filters,
    results,
    isLoading: isSearching,
    isError: !!error,
    error,
    hasSearched,
    setQuery,
    setFilters,
    search,
    searchWithQuery,
    clearResults,
    refetch,
  };
}
