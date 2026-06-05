import React from 'react';
import './NutritionCard.css';

interface NutritionCardProps {
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({
  calories,
  protein = 0,
  carbs = 0,
  fat = 0,
}) => {
  const targets = { protein: 40, carbs: 80, fat: 25 };

  const getPercent = (value: number, target: number) => {
    return Math.min(100, Math.max(0, (value / target) * 100));
  };

  return (
    <div className="nutrition-card">
      <div className="nutrition-card__header">
        <div className="nutrition-card__calories-value">{calories}</div>
        <div className="nutrition-card__calories-label">Calories / serving</div>
      </div>

      <div className="nutrition-card__macros">
        <div className="macro-bar">
          <div className="macro-bar__header">
            <span className="macro-bar__name">Protein</span>
            <span className="macro-bar__value">{protein}g</span>
          </div>
          <div className="macro-bar__track">
            <div
              className="macro-bar__fill macro-bar__fill--protein"
              style={{ width: `${getPercent(protein, targets.protein)}%` }}
            />
          </div>
        </div>

        <div className="macro-bar">
          <div className="macro-bar__header">
            <span className="macro-bar__name">Carbohydrates</span>
            <span className="macro-bar__value">{carbs}g</span>
          </div>
          <div className="macro-bar__track">
            <div
              className="macro-bar__fill macro-bar__fill--carbs"
              style={{ width: `${getPercent(carbs, targets.carbs)}%` }}
            />
          </div>
        </div>

        <div className="macro-bar">
          <div className="macro-bar__header">
            <span className="macro-bar__name">Fat</span>
            <span className="macro-bar__value">{fat}g</span>
          </div>
          <div className="macro-bar__track">
            <div
              className="macro-bar__fill macro-bar__fill--fat"
              style={{ width: `${getPercent(fat, targets.fat)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default NutritionCard;
