import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { ErrorState } from '@/components/ui/ErrorState';
import { IngredientList } from '@/components/recipe/IngredientList';
import { InstructionSteps } from '@/components/recipe/InstructionSteps';
import { NutritionCard } from '@/components/recipe/NutritionCard';
import { RecipeHeader } from '@/components/recipe-detail/RecipeHeader';
import { RecipeInsights } from '@/components/recipe-detail/RecipeInsights';
import { RecipeStickyBar } from '@/components/recipe-detail/RecipeStickyBar';
import { CookingModeModal } from '@/components/recipe-detail/CookingModeModal';
import { useFavorites } from '@/hooks/useFavorites';
import { useAssistantStore } from '@/store/assistantStore';
import { useSearchStore } from '@/store/searchStore';
import { getRecipeById, getAllRecipes } from '@/services/aiService';
import type { Recipe } from '@/types';
import './RecipeDetail.css';

function useRecipe(id: string | undefined): Recipe | null {
  const searchResults = useSearchStore((s) => s.results);
  const { favorites } = useFavorites();
  if (!id) return null;
  return (
    getRecipeById(id) ||
    getAllRecipes().find((r) => r.id === id) ||
    searchResults.find((r) => r.id === id) ||
    favorites.find((r) => r.id === id) ||
    null
  );
}

export const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorited, toggle } = useFavorites();
  const { setRecipeContext, newConversation } = useAssistantStore();

  const recipe = useRecipe(id);
  const [isCookingModeOpen, setIsCookingModeOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!recipe) {
    return (
      <PageWrapper className="recipe-detail">
        <ErrorState
          icon={<FiBookOpen />}
          title="Recipe Not Found"
          message="This recipe may have expired from your search results. Go back and search again to rediscover it."
          onRetry={() => navigate(-1)}
          retryLabel="Go Back"
          secondaryLabel="Browse All Recipes"
          onSecondary={() => navigate('/recommendations')}
          className="recipe-detail__not-found"
        />
      </PageWrapper>
    );
  }

  const handleAskAI = () => {
    setRecipeContext(recipe.title);
    newConversation(`Cooking Guidance: ${recipe.title}`);
    navigate('/assistant');
  };

  return (
    <PageWrapper className="recipe-detail">
      <RecipeHeader recipe={recipe} />

      <div className="recipe-detail__grid">
        <div className="recipe-detail__left-col">
          <IngredientList ingredients={recipe.ingredients} originalServings={recipe.servings} />
          <InstructionSteps steps={recipe.instructions} />
        </div>
        <div className="recipe-detail__right-col">
          <NutritionCard
            calories={recipe.calories}
            protein={recipe.protein}
            carbs={recipe.carbs}
            fat={recipe.fat}
          />
          <RecipeInsights aiTip={recipe.aiTip} aiInsights={recipe.aiInsights} />
        </div>
      </div>

      <RecipeStickyBar
        isFav={isFavorited(recipe.id)}
        onToggleFav={() => toggle(recipe)}
        onAskAI={handleAskAI}
        onStartCooking={() => setIsCookingModeOpen(true)}
      />

      <CookingModeModal
        isOpen={isCookingModeOpen}
        onClose={() => setIsCookingModeOpen(false)}
        recipe={recipe}
      />
    </PageWrapper>
  );
};

export default RecipeDetail;
