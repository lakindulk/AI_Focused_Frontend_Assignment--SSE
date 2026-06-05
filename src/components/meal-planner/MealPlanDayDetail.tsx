import React from "react";
import { FiCalendar, FiPlus } from "react-icons/fi";
import { FiCoffee, FiSun, FiMoon } from "react-icons/fi";
import type { MealPlanDay, Recipe } from "@/types";

const MEAL_ICONS: Record<string, React.ReactNode> = {
  breakfast: <FiCoffee size={12} />,
  lunch:     <FiSun    size={12} />,
  dinner:    <FiMoon   size={12} />,
};

interface MealPlanDayDetailProps {
  dayData: MealPlanDay;
  getDayTotal: (day: MealPlanDay) => number;
  getDayProtein: (day: MealPlanDay) => number;
  onSlotClick: (recipe: Recipe | null) => void;
}

export const MealPlanDayDetail: React.FC<MealPlanDayDetailProps> = ({
  dayData, getDayTotal, getDayProtein, onSlotClick,
}) => (
  <div className="planner-detail">
    <div className="planner-detail__header">
      <div className="planner-detail__day-info">
        <FiCalendar />
        <h2 className="planner-detail__day-name">{dayData.day}</h2>
      </div>
      <div className="planner-detail__stats">
        <span className="planner-detail__stat">
          <strong>{getDayTotal(dayData)}</strong> kcal
        </span>
        <span className="planner-detail__stat-sep" />
        <span className="planner-detail__stat">
          <strong>{getDayProtein(dayData)}g</strong> protein
        </span>
      </div>
    </div>

    <div className="planner-detail__meals">
      {(["breakfast", "lunch", "dinner"] as const).map((mealKey) => {
        const recipe = dayData[mealKey];
        return (
          <div key={mealKey} className="planner-meal-card">
            <div className="planner-meal-card__label">
              {MEAL_ICONS[mealKey]}
              <span>{mealKey.charAt(0).toUpperCase() + mealKey.slice(1)}</span>
            </div>
            {recipe ? (
              <div
                className="planner-meal-card__content"
                onClick={() => onSlotClick(recipe)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSlotClick(recipe)}
              >
                <div className="planner-meal-card__info">
                  <h4 className="planner-meal-card__title">{recipe.title}</h4>
                  <p className="planner-meal-card__desc">{recipe.description}</p>
                  <div className="planner-meal-card__meta">
                    <span className="planner-meal-card__meta-item">🔥 {recipe.calories} kcal</span>
                    <span className="planner-meal-card__meta-sep" />
                    <span className="planner-meal-card__meta-item">⏱ {recipe.cookingTime}m</span>
                    {recipe.protein != null && (
                      <>
                        <span className="planner-meal-card__meta-sep" />
                        <span className="planner-meal-card__meta-item">💪 {recipe.protein}g protein</span>
                      </>
                    )}
                  </div>
                  {recipe.dietaryTags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="planner-meal-card__tag">{tag}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="planner-meal-card__empty"
                onClick={() => onSlotClick(null)}
                role="button"
                tabIndex={0}
              >
                <FiPlus size={20} />
                <span>Add {mealKey}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
