import React from "react";
import { HiSparkles } from "react-icons/hi2";
import { CUISINE_EMOJI } from "@/constants";
import type { Recipe } from "@/types";

interface RecipeHeaderProps {
  recipe: Recipe;
}

export const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipe }) => {
  const cuisineEmoji = CUISINE_EMOJI[(recipe.cuisineType || "").toLowerCase()] || "🍽️";

  return (
    <div className="recipe-detail__header">
      <span className="recipe-detail__header-emoji" aria-hidden="true">{cuisineEmoji}</span>
      <div className="recipe-detail__header-content">
        <h1 className="recipe-detail__title">{recipe.title}</h1>
        <p className="recipe-detail__desc">{recipe.description}</p>

        {recipe.aiMatchScore !== undefined && recipe.aiMatchScore > 0 && (
          <div className="recipe-detail__match-row">
            <span className="recipe-detail__match-score">
              <HiSparkles />
              {recipe.aiMatchScore}% AI Match
            </span>
            {recipe.matchReasons?.map((reason) => (
              <span key={reason} className="recipe-detail__match-reason">
                ✓ {reason}
              </span>
            ))}
          </div>
        )}

        {recipe.dietaryTags.length > 0 && (
          <div className="recipe-detail__tags">
            {recipe.dietaryTags.map((tag) => (
              <span key={tag} className="recipe-detail__tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
