import React from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiClock, FiActivity, FiChevronRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { CUISINE_EMOJI } from "@/constants";
import type { Recipe } from "@/types";

type PickerSource = "ingredient" | "image";

interface IngredientPickerProps {
  pickerRef: React.RefObject<HTMLDivElement | null>;
  pickerSource: PickerSource;
  imagePreview: string | null;
  isPickerLoading: boolean;
  detectedIngredients: string[];
  activeIngredient: string | null;
  pickerRecipes: Recipe[];
  onClose: () => void;
}

export const IngredientPicker: React.FC<IngredientPickerProps> = ({
  pickerRef, pickerSource, imagePreview, isPickerLoading,
  detectedIngredients, activeIngredient, pickerRecipes, onClose,
}) => {
  const navigate = useNavigate();

  return (
    <div className="home-picker-second" ref={pickerRef} role="region" aria-label="Recipe suggestions">
      <div className="home-picker__header">
        <div className="home-picker__title">
          {pickerSource === "image" ? (
            <>
              {imagePreview && (
                <img src={imagePreview} alt="Uploaded" className="home-picker__thumb" />
              )}
              <span>
                <HiSparkles className="home-picker__title-icon" />
                {isPickerLoading ? (
                  "Analysing your photo…"
                ) : detectedIngredients.length > 0 ? (
                  <>
                    Recipes from{" "}
                    <strong>
                      {detectedIngredients.slice(0, 4).join(", ")}
                      {detectedIngredients.length > 4 ? "…" : ""}
                    </strong>
                  </>
                ) : (
                  "Recipes from your photo"
                )}
              </span>
            </>
          ) : (
            <>
              <HiSparkles className="home-picker__title-icon" />
              Recipes with <strong>{activeIngredient}</strong>
            </>
          )}
        </div>
        <button
          type="button"
          className="home-picker__close"
          onClick={onClose}
          aria-label="Close recipe suggestions"
        >
          <FiX />
        </button>
      </div>

      {pickerSource === "image" && !isPickerLoading && detectedIngredients.length > 0 && (
        <div className="home-picker__detected">
          <span className="home-picker__detected-label">Detected:</span>
          {detectedIngredients.map((ing) => (
            <span key={ing} className="home-picker__detected-chip">{ing}</span>
          ))}
        </div>
      )}

      {isPickerLoading ? (
        <div className="home-picker__skeleton-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="home-picker__skeleton-card">
              <div className="home-picker__skeleton-banner" />
              <div className="home-picker__skeleton-line home-picker__skeleton-line--title" />
              <div className="home-picker__skeleton-line home-picker__skeleton-line--meta" />
            </div>
          ))}
        </div>
      ) : (
        <div className="home-picker__grid">
          {pickerRecipes.map((recipe) => {
            const emoji = CUISINE_EMOJI[(recipe.cuisineType || "").toLowerCase()] || "🍽️";
            return (
              <button
                key={recipe.id}
                type="button"
                className="home-pick-card"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                aria-label={`View recipe: ${recipe.title}`}
              >
                <div className="home-pick-card__banner">
                  <span className="home-pick-card__emoji" aria-hidden="true">{emoji}</span>
                  {recipe.aiMatchScore !== undefined && recipe.aiMatchScore > 0 && (
                    <span className="home-pick-card__score">
                      <HiSparkles /> {recipe.aiMatchScore}%
                    </span>
                  )}
                </div>
                <div className="home-pick-card__body">
                  <h4 className="home-pick-card__title">{recipe.title}</h4>
                  <div className="home-pick-card__meta">
                    <span><FiClock /> {recipe.cookingTime}m</span>
                    <span><FiActivity /> {recipe.calories} kcal</span>
                    <span className={`home-pick-card__diff home-pick-card__diff--${recipe.difficulty.toLowerCase()}`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  <span className="home-pick-card__cta">
                    View Recipe <FiChevronRight />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
