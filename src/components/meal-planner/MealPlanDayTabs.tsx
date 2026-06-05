import React from "react";
import type { MealPlanDay } from "@/types";

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu",
  Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

interface MealPlanDayTabsProps {
  mealPlan: MealPlanDay[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
  getDayTotal: (day: MealPlanDay) => number;
}

export const MealPlanDayTabs: React.FC<MealPlanDayTabsProps> = ({
  mealPlan, selectedDay, onSelectDay, getDayTotal,
}) => (
  <div className="planner-days-strip">
    {mealPlan.map((dayPlan) => (
      <button
        key={dayPlan.day}
        type="button"
        className={`planner-day-tab ${dayPlan.day === selectedDay ? "planner-day-tab--active" : ""}`}
        onClick={() => onSelectDay(dayPlan.day)}
      >
        <span className="planner-day-tab__name">
          {DAY_SHORT[dayPlan.day] ?? dayPlan.day.slice(0, 3)}
        </span>
        <span className="planner-day-tab__cals">{getDayTotal(dayPlan)} kcal</span>
      </button>
    ))}
  </div>
);
