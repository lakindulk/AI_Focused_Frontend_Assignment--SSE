import React from "react";

const CATEGORIES = [
  { label: "High Protein", emoji: "💪", query: "high protein" },
  { label: "Quick & Easy", emoji: "⚡", query: "quick easy under 20 minutes" },
  { label: "Vegetarian", emoji: "🥗", query: "vegetarian healthy" },
  { label: "Comfort Food", emoji: "🍲", query: "comfort food hearty" },
  { label: "Keto", emoji: "🥑", query: "keto low carb" },
  { label: "Breakfast", emoji: "🍳", query: "healthy breakfast" },
  { label: "Asian Fusion", emoji: "🍜", query: "asian fusion stir fry" },
  { label: "Desserts", emoji: "🍰", query: "healthy dessert low calorie" },
];

interface CategoriesSectionProps {
  onSearch: (term: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSearch }) => (
  <section className="home-categories">
    <div className="home-categories__inner">
      <div className="home-section-header home-section-header--left">
        <span className="home-section-eyebrow">Browse by Category</span>
        <h2 className="home-section-title">Popular Recipe Categories</h2>
      </div>
      <div className="home-categories__grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            type="button"
            className="home-cat-card"
            onClick={() => onSearch(cat.query)}
          >
            <span className="home-cat-card__emoji">{cat.emoji}</span>
            <span className="home-cat-card__label">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  </section>
);
