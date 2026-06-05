import { useFavoriteStore } from '@/store/favoriteStore';
import type { Recipe } from '@/types';

export function useFavorites() {
  const { favorites, toggleFavorite, isFavorited, clearAll, getFavoritesByTag } =
    useFavoriteStore();

  return {
    favorites,
    toggle: toggleFavorite,
    isFavorited,
    clearAll,
    getFavoritesByTag,
    count: favorites.length,
    isEmpty: favorites.length === 0,
    add: (recipe: Recipe) => {
      if (!isFavorited(recipe.id)) {
        toggleFavorite(recipe);
      }
    },
    remove: (recipe: Recipe) => {
      if (isFavorited(recipe.id)) {
        toggleFavorite(recipe);
      }
    },
  };
}
