import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '@/types';

interface FavoriteState {
  favorites: Recipe[];
  toggleFavorite: (recipe: Recipe) => void;
  isFavorited: (id: string) => boolean;
  clearAll: () => void;
  getFavoritesByTag: (tag: string) => Recipe[];
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (recipe) => {
        set((state) => {
          const exists = state.favorites.find((r) => r.id === recipe.id);
          return {
            favorites: exists
              ? state.favorites.filter((r) => r.id !== recipe.id)
              : [...state.favorites, { ...recipe, createdAt: new Date().toISOString() }],
          };
        });
      },

      isFavorited: (id) => get().favorites.some((r) => r.id === id),

      clearAll: () => set({ favorites: [] }),

      getFavoritesByTag: (tag) => {
        if (tag === 'All') return get().favorites;
        return get().favorites.filter((r) =>
          r.dietaryTags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
        );
      },
    }),
    {
      name: 'chef-ai-favorites',
    }
  )
);
