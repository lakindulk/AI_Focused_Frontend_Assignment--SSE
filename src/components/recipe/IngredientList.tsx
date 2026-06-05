import React, { useState } from 'react';
import { FiPlus, FiMinus, FiCheck } from 'react-icons/fi';
import type { Ingredient } from '@/types';
import './IngredientList.css';

interface IngredientListProps {
  ingredients: Ingredient[];
  originalServings: number;
}

export const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  originalServings,
}) => {
  const [servings, setServings] = useState(originalServings);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleToggle = (name: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const adjustServings = (amount: number) => {
    setServings((prev) => Math.max(1, prev + amount));
  };

  const scaleAmount = (amountStr: string): string => {
    if (!amountStr) return '';

    const ratio = servings / originalServings;
    if (ratio === 1) return amountStr;

    const parseValue = (str: string): number | null => {
      const trimmed = str.trim();
      if (trimmed.includes('/')) {
        const parts = trimmed.split('/');
        if (parts.length === 2) {
          const num = parseFloat(parts[0]);
          const den = parseFloat(parts[1]);
          if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
        }
      }
      const val = parseFloat(trimmed);
      return isNaN(val) ? null : val;
    };

    const decimalValue = parseValue(amountStr);

    if (decimalValue !== null) {
      const formatted = Math.round(decimalValue * ratio * 100) / 100;
      if (formatted === 0.5) return '1/2';
      if (formatted === 0.25) return '1/4';
      if (formatted === 0.75) return '3/4';
      if (formatted === 1.5) return '1 1/2';
      if (formatted === 2.5) return '2 1/2';
      return formatted.toString();
    }

    if (amountStr.includes('-')) {
      const parts = amountStr.split('-');
      if (parts.length === 2) {
        const p1 = parseValue(parts[0]);
        const p2 = parseValue(parts[1]);
        if (p1 !== null && p2 !== null) {
          const s1 = Math.round(p1 * ratio * 10) / 10;
          const s2 = Math.round(p2 * ratio * 10) / 10;
          return `${s1}-${s2}`;
        }
      }
    }

    return amountStr;
  };

  return (
    <div className="ingredients">
      <div className="ingredients__header">
        <h3 className="ingredients__title">Ingredients</h3>
        <div className="servings-control">
          <span className="servings-control__label">Servings</span>
          <button
            type="button"
            className="servings-control__btn"
            onClick={() => adjustServings(-1)}
            disabled={servings <= 1}
            aria-label="Decrease servings"
          >
            <FiMinus />
          </button>
          <span className="servings-control__count">{servings}</span>
          <button
            type="button"
            className="servings-control__btn"
            onClick={() => adjustServings(1)}
            aria-label="Increase servings"
          >
            <FiPlus />
          </button>
        </div>
      </div>

      <div className="ingredients__list">
        {ingredients.map((ing) => {
          const isChecked = !!checkedItems[ing.name];
          return (
            <div
              key={ing.name}
              className={`ingredient-item ${isChecked ? 'ingredient-item--checked' : ''}`}
              onClick={() => handleToggle(ing.name)}
            >
              <div className="ingredient-item__checkbox">
                <FiCheck className="ingredient-item__checkbox-check" />
              </div>
              <span className="ingredient-item__name">
                {ing.name}
                {ing.optional && <span style={{ fontStyle: 'italic', opacity: 0.7 }}> (optional)</span>}
              </span>
              <span className="ingredient-item__amount">
                {scaleAmount(ing.amount)} {ing.unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
