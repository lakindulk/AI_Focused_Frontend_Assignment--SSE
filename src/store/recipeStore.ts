import { create } from 'zustand';
import type { Recipe } from '@/types';
import { getAllRecipes } from '@/services/aiService';

interface RecipeState {
  currentRecipe: Recipe | null;
  recommendations: Recipe[];
  isLoading: boolean;
  error: string | null;

  setCurrentRecipe: (recipe: Recipe | null) => void;
  loadRecommendations: () => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  currentRecipe: null,
  recommendations: [],
  isLoading: false,
  error: null,

  setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),

  loadRecommendations: () => {
    set({ isLoading: true });
    try {
      const recipes = getAllRecipes();
      set({ recommendations: recipes, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load recipes',
        isLoading: false,
      });
    }
  },
}));
