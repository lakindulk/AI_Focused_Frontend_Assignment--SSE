import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiClock, FiActivity, FiUsers } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { useFavorites } from '@/hooks/useFavorites';
import { Badge } from '@/components/ui/Badge';
import { CUISINE_EMOJI } from '@/constants';
import type { Recipe } from '@/types';
import './RecipeCard.css';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const navigate = useNavigate();
  const { isFavorited, toggle } = useFavorites();
  const favorited = isFavorited(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggle(recipe);
  };

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const formatDifficulty = (diff: string): 'easy' | 'medium' | 'hard' => {
    const val = diff.toLowerCase();
    if (val === 'easy' || val === 'medium' || val === 'hard') return val as 'easy' | 'medium' | 'hard';
    return 'medium';
  };

  const hasMatchScore = recipe.aiMatchScore !== undefined && recipe.aiMatchScore > 0;
  const cuisineEmoji = CUISINE_EMOJI[(recipe.cuisineType || '').toLowerCase()] || '🍽️';

  return (
    <div
      className="recipe-card"
      onClick={handleCardClick}
      role="article"
      aria-label={`Recipe: ${recipe.title}`}
    >
      <div className="recipe-card__top-bar">
        <div className="recipe-card__top-info">
          <span className="recipe-card__cuisine-emoji" aria-hidden="true">{cuisineEmoji}</span>
          {recipe.cuisineType && (
            <span className="recipe-card__cuisine-tag">{recipe.cuisineType}</span>
          )}
          {hasMatchScore && (
            <div className="recipe-card__match-badge" title={`${recipe.aiMatchScore}% AI match`}>
              <HiSparkles className="recipe-card__match-icon" />
              <span>{recipe.aiMatchScore}%</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`recipe-card__fav-btn ${favorited ? 'recipe-card__fav-btn--active' : ''}`}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiHeart fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="recipe-card__body">
        {recipe.matchReasons && recipe.matchReasons.length > 0 && (
          <div className="recipe-card__reasons">
            {recipe.matchReasons.slice(0, 2).map((reason, idx) => (
              <span key={idx} className="recipe-card__reason-tag">
                {reason}
              </span>
            ))}
          </div>
        )}

        <h3 className="recipe-card__title">{recipe.title}</h3>

        {recipe.description && (
          <p className="recipe-card__desc">{recipe.description}</p>
        )}

        <div className="recipe-card__badges">
          <Badge variant="time" icon={<FiClock />}>
            {recipe.cookingTime}m
          </Badge>
          <Badge variant="calorie" icon={<FiActivity />}>
            {recipe.calories} kcal
          </Badge>
          <Badge variant={formatDifficulty(recipe.difficulty)}>
            {recipe.difficulty}
          </Badge>
          {recipe.servings && (
            <Badge variant="diet" icon={<FiUsers />}>
              {recipe.servings} srv
            </Badge>
          )}
        </div>

        {recipe.aiTip && (
          <div className="recipe-card__ai-tip">
            <HiSparkles className="recipe-card__ai-tip-icon" />
            <span>{recipe.aiTip}</span>
          </div>
        )}
      </div>
    </div>
  );
};
