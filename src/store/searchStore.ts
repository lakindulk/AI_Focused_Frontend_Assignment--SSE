import { create } from 'zustand';
import type { Recipe, SearchFilters } from '@/types';
import { smartSearch, generateRecipes } from '@/services/aiService';

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
  searchWithQuery: (query: string) => Promise<void>;
  storeResults: (results: Recipe[]) => void;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  filters: {
    ingredients: [],
    dietaryTags: [],
  },
  results: [],
  isSearching: false,
  error: null,
  hasSearched: false,

  setQuery: (query) => set({ query }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  search: async () => {
    const { query, filters } = get();
    set({ isSearching: true, error: null, hasSearched: true });

    try {
      let results: Recipe[];

      if (query && !filters.ingredients.length && !filters.dietaryTags.length) {
        results = await smartSearch(query);
      } else {
        results = await generateRecipes(query, {
          ingredients: filters.ingredients,
          dietary: filters.dietaryTags,
          maxTime: filters.maxCookingTime,
          maxCalories: filters.maxCalories,
        });
      }

      set({ results, isSearching: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Search failed. Please try again.',
        isSearching: false,
      });
    }
  },

  searchWithQuery: async (query: string) => {
    set({ query });
    const { search } = get();
    await search();
  },

  storeResults: (results: Recipe[]) => set({ results }),

  clearResults: () =>
    set({
      results: [],
      query: '',
      filters: { ingredients: [], dietaryTags: [] },
      hasSearched: false,
      error: null,
    }),
}));
