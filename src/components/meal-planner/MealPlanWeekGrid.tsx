import React from "react";
import { FiPlus } from "react-icons/fi";
import type { MealPlanDay, Recipe } from "@/types";

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu",
  Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

interface MealPlanWeekGridProps {
  mealPlan: MealPlanDay[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
  onSlotClick: (recipe: Recipe | null) => void;
  getDayTotal: (day: MealPlanDay) => number;
}

export const MealPlanWeekGrid: React.FC<MealPlanWeekGridProps> = ({
  mealPlan, selectedDay, onSelectDay, onSlotClick, getDayTotal,
}) => (
  <div className="planner-week-grid">
    <h3 className="planner-week-grid__title">Full Week Overview</h3>
    <div className="planner-grid">
      {mealPlan.map((dayPlan) => (
        <div
          key={dayPlan.day}
          className={`planner-day-col ${dayPlan.day === selectedDay ? "planner-day-col--selected" : ""}`}
          onClick={() => onSelectDay(dayPlan.day)}
        >
          <div className="planner-day-col__header">
            <span className="planner-day-col__name">
              {DAY_SHORT[dayPlan.day] ?? dayPlan.day.slice(0, 3)}
            </span>
            <div className="planner-day-col__summary">{getDayTotal(dayPlan)} kcal</div>
          </div>

          <div className="planner-day-col__slots">
            {(["breakfast", "lunch", "dinner"] as const).map((mealKey) => {
              const recipe = dayPlan[mealKey];
              return (
                <div key={mealKey} className="meal-slot">
                  <span className="meal-slot__label">
                    {mealKey.slice(0, 1).toUpperCase() + mealKey.slice(1)}
                  </span>
                  {recipe ? (
                    <div
                      className="meal-slot-card"
                      onClick={(e) => { e.stopPropagation(); onSlotClick(recipe); }}
                    >
                      <h4 className="meal-slot-card__title">{recipe.title}</h4>
                      <span className="meal-slot-card__calories">{recipe.calories} kcal</span>
                    </div>
                  ) : (
                    <div
                      className="meal-slot-card meal-slot-card--empty"
                      onClick={(e) => { e.stopPropagation(); onSlotClick(null); }}
                    >
                      <FiPlus size={12} /> Add
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);
