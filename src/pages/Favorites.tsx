import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { RecipeGrid } from '@/components/recipe/RecipeGrid';
import { FavoritesCategoryTabs } from '@/components/favorites/FavoritesCategoryTabs';
import { FavoritesFilterBar } from '@/components/favorites/FavoritesFilterBar';
import { useFavorites } from '@/hooks/useFavorites';
import type { Recipe } from '@/types';
import './Favorites.css';

type SortOption = 'recent' | 'name' | 'calories' | 'time';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'High Protein', 'Vegetarian'];

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, toggle } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const getFilteredFavorites = () => {
    let list = [...favorites];

    if (activeCategory !== 'All') {
      list = list.filter((r) => {
        if (activeCategory === 'High Protein') return (r.protein || 0) >= 20;
        return r.dietaryTags.some((tag) => tag.toLowerCase().includes(activeCategory.toLowerCase()));
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.title.localeCompare(b.title);
        case 'calories': return a.calories - b.calories;
        case 'time': return a.cookingTime - b.cookingTime;
        default: return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
    });

    return list;
  };

  const handleRemoveWithUndo = (recipe: Recipe) => {
    toggle(recipe);
    toast((t) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Removed "{recipe.title}"</span>
        <button
          onClick={() => { toggle(recipe); toast.dismiss(t.id); }}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer', padding: '2px 6px' }}
        >
          Undo
        </button>
      </div>
    ), { duration: 4000 });
  };

  const filteredList = getFilteredFavorites();

  return (
    <PageWrapper className="favs-page">
      <div className="favs-header">
        <h1 className="favs-header__title">Saved Recipes</h1>
      </div>

      <FavoritesCategoryTabs
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <FavoritesFilterBar
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
      />

      {favorites.length === 0 ? (
        <RecipeGrid
          recipes={[]}
          emptyTitle="No Saved Recipes"
          emptyMessage="Your favorite list is currently empty. Start exploring recipes and tap the heart icon to save them here!"
          emptyActionLabel="Discover Recipes"
          onEmptyAction={() => navigate('/recommendations')}
        />
      ) : filteredList.length === 0 ? (
        <RecipeGrid
          recipes={[]}
          emptyTitle="No Matches Found"
          emptyMessage={`We couldn't find any saved recipes matching "${searchQuery}" in category "${activeCategory}".`}
          emptyActionLabel="Clear Search"
          onEmptyAction={() => { setSearchQuery(''); setActiveCategory('All'); }}
        />
      ) : (
        <RecipeGrid recipes={filteredList} />
      )}
    </PageWrapper>
  );
};

export default Favorites;
