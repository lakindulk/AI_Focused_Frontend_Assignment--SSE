import { create } from 'zustand';
import type { Recipe, SearchFilters } from '@/types';
import { streamSmartSearch, streamGenerateRecipes } from '@/services/aiService';

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Recipe[];
  isSearching: boolean;
  error: string | null;
  hasSearched: boolean;

  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  search: () => Promise<void>;
  searchWithQuery: (query: string) => void;
  storeResults: (results: Recipe[]) => void;
  clearResults: () => void;

  // internal — not persisted
  _controller: AbortController | null;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  filters: { ingredients: [], dietaryTags: [] },
  results: [],
  isSearching: false,
  error: null,
  hasSearched: false,
  _controller: null,

  setQuery: (query) => set({ query }),

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  search: async () => {
    // Cancel any in-flight request
    get()._controller?.abort();
    const controller = new AbortController();
    const { query, filters } = get();

    set({ isSearching: true, error: null, hasSearched: true, results: [], _controller: controller });

    try {
      const stream =
        query && !filters.ingredients?.length && !filters.dietaryTags?.length
          ? streamSmartSearch(query, controller.signal)
          : streamGenerateRecipes(
              query,
              {
                ingredients: filters.ingredients,
                dietary: filters.dietaryTags,
                maxTime: filters.maxCookingTime,
                maxCalories: filters.maxCalories,
              },
              controller.signal
            );

      for await (const partial of stream) {
        if (controller.signal.aborted) return;
        set({ results: partial });
      }

      if (!controller.signal.aborted) {
        set({ isSearching: false, _controller: null });
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      set({
        error: err instanceof Error ? err.message : 'Search failed. Please try again.',
        isSearching: false,
        _controller: null,
      });
    }
  },

  // Fire-and-forget: sets query, starts streaming search in background
  searchWithQuery: (query: string) => {
    set({ query });
    void get().search();
  },

  storeResults: (results) => set({ results }),

  clearResults: () => {
    get()._controller?.abort();
    set({
      results: [],
      query: '',
      filters: { ingredients: [], dietaryTags: [] },
      hasSearched: false,
      error: null,
      _controller: null,
    });
  },
}));
